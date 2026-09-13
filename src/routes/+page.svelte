<script lang="ts">
	import { onMount } from 'svelte';
	import { Application, Assets, Text, TextStyle } from 'pixi.js';
	import type { Root } from '$lib/types/mandatfordelning';
	import { BarChart, type ChartData } from '$lib/graph/BarChart';
    import { Bar } from '$lib/graph/Bar';
    import { Diamond } from '$lib/graph/Diamond';
    import { MandatBar } from '$lib/graph/MandatBar';
    import { PARTY_DATA } from '$lib/PartyData';
    import { page } from '$app/state';

	let canvasHost: HTMLDivElement;
	let data: Root | null = null;


	let leftMandatGroup = $derived(
		page.url.searchParams.get('left')
			? page.url.searchParams.get('left')!.split(',')
			: PARTY_DATA.DEFAULT_MANDAT_GROUPS.left
	);
	let rightMandatGroup = $derived(
		page.url.searchParams.get('right')
			? page.url.searchParams.get('right')!.split(',')
			: PARTY_DATA.DEFAULT_MANDAT_GROUPS.right
	);

	onMount(() => {
		let interval: ReturnType<typeof setInterval>;

		(async () => {
			const app = new Application();

			await app.init({
				width: 1920,
				height: 1080,
				backgroundAlpha: 0, // 0 = Fully transparent background
				resolution: window.devicePixelRatio || 1,
				autoDensity: true
			});

			canvasHost.appendChild(app.canvas);

			await Assets.load({
				src: 'fonts/HardCompound.ttf',
				data: { family: 'Hard Compound' }
			});

			await Assets.load({
				src: 'fonts/BebasNeue.ttf',
				data: { family: 'Bebas Neue' }
			});

			const textStyle = new TextStyle({
				fontFamily: 'Bebas Neue',
				fontSize: 30,
				fill: 0xffffff,
				fontWeight: 'bold',
				stroke: { color: 0x000000, width: 6, join: 'round' }
			});

			// Top left corner
			const votesText = new Text({ text: '', style: textStyle });
			votesText.anchor.set(0, 0);
			votesText.x = 100;
			votesText.y = app.screen.height - 250;

			// Top right corner
			const updateText = new Text({ text: '', style: textStyle });
			updateText.anchor.set(1, 0);
			updateText.x = app.screen.width - 20;
			updateText.y = 20;

			// Top middle
			const testText = new Text({ text: '', style: textStyle });
			testText.anchor.set(0.5, 0);
			testText.x = app.screen.width/2;
			testText.y = 20;

			app.stage.addChild(votesText, updateText, testText);

			let chart: BarChart | null = null;
			let bar: Bar | null = null;
			let diamond: Diamond | null = null;
			let mandatBar: MandatBar | null = null;

			const fetchData = async () => {
				console.log('Fetching data...');
				const res = await fetch('/api/data');
				if (!res.ok) {
					throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
				}
				data = await res.json();
				console.log('Data fetched:', data);

				if (data) {
					votesText.text = `Räknade röster: ${data.valomrade.totaltAntalRoster.toLocaleString('sv-SE')}\nRäknade Valdistrikt:\n${data.valomrade.antalValdistriktRaknade} av ${data.valomrade.antalValdistriktSomSkaRaknas}`;
					updateText.text = `Senast uppdaterad: ${new Date(data.senasteUppdateringstid).toLocaleTimeString('sv-SE')}`;
					testText.text = data.test ? "ALL DATA ÄR TESTER AV VALMYNDIGHETEN!" : "";

					const chartData: ChartData[] = [];
					const backgroundData: ChartData[] = [];

					data.valomrade.rostfordelning.rosterPaverkaMandat.partiRoster.sort((a, b) => PARTY_DATA.partier.get(a.partikod)!.order - PARTY_DATA.partier.get(b.partikod)!.order);

					for (const party of data.valomrade.rostfordelning.rosterPaverkaMandat.partiRoster) {
						chartData.push({
							label: party.partiforkortning,
							value: party.andelRoster,
							color: Number(`0x${PARTY_DATA.partier.get(party.partikod)?.color.substring(1)}`)
						});
						backgroundData.push({
							value: party.andelRosterForegaendeVal || 0,
							color: 0x000000 // Black color for background
						});

					}

					chartData.push({
						label: 'Övriga',
						value: data.valomrade.rostfordelning.rosterPaverkaMandat.rosterOvrigaPartier.andelRoster,
						color: 0x808080 // Gray color for "Övriga"
					});
					backgroundData.push({
						value:
							data.valomrade.rostfordelning.rosterPaverkaMandat.rosterOvrigaPartier
								.andelRosterForegaendeVal || 0,
						color: 0x000000 // Black color for background
					});

					let valDistrictsCounted = data.valomrade.antalValdistriktRaknade;
					let valDistrictsTotal = data.valomrade.antalValdistriktSomSkaRaknas;

					const mandatfordelning = data.valomrade.mandatfordelning?.partiLista ?? [];
					const totalMandat = data.valomrade.totaltAntalMandat;

					// Fall back to estimating mandates from vote shares while the
					// official mandate distribution isn't published yet.
					let mandatByParty = new Map(mandatfordelning.map((p) => [p.partikod, p.antalMandat]));
					if (mandatByParty.size === 0) {
						const estimMandat = new Map<string, number>();
						for (const party of data.valomrade.rostfordelning.rosterPaverkaMandat.partiRoster) {
							estimMandat.set(party.partikod, Math.round((party.andelRoster / 100) * totalMandat));
						}
						mandatByParty = estimMandat;
					}

					const sumMandat = (ids: string[]) =>
						ids.reduce((sum, id) => sum + (mandatByParty.get(id) ?? 0), 0);

					const leftValue = sumMandat(leftMandatGroup);
					const rightValue = sumMandat(rightMandatGroup);

					if (!chart) {
						chart = new BarChart(chartData, backgroundData);
						const totalWidth = chartData.length * (90 + 50) - 50;
						chart.x = (app.screen.width - totalWidth - 30);
						chart.y = app.screen.height - 245; // 60px margin for labels below the baseline
						app.stage.addChild(chart);

						bar = new Bar({ width: 40, height: 900, maxValue: valDistrictsTotal}, { value: valDistrictsCounted, color: 0xFF0000 });
						bar.x = 50;
						bar.y = app.screen.height - 1050;
						app.stage.addChild(bar);

						mandatBar = new MandatBar({
							height: 50,
							width: 1090,
							maxValue: totalMandat,
							leftValue: leftValue,
							leftColor: 0xff0000,
							leftLabel: leftMandatGroup.map((id) => PARTY_DATA.partier.get(id)?.shortName).join('+'),
							rightValue: rightValue,
							rightColor: 0x52BDEC,
							rightLabel: rightMandatGroup.map((id) => PARTY_DATA.partier.get(id)?.shortName).join('+'),
							textStyle: textStyle
						});
						mandatBar.x = 680;
						mandatBar.y = app.screen.height - 200;
						app.stage.addChild(mandatBar);
					} else {
						chart.updateChart(chartData.map((d) => d.value));
						chart.updateBackgroundChart(backgroundData.map((d) => d.value));
						if (bar) bar.update({ value: valDistrictsCounted, color: 0xFF0000 });
						if (mandatBar) mandatBar.update({ leftValue: leftValue, rightValue: rightValue });
					}
				}
			};

			await fetchData();
			interval = setInterval(fetchData, 1000 * 60 * 5); // Fetch data every 5 minutes
		})();

		return () => clearInterval(interval);
	});
</script>

<div bind:this={canvasHost}></div>
