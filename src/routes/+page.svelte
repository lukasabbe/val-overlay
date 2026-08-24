<script lang="ts">
	import { onMount } from 'svelte';
	import { Application, Assets, Text, TextStyle } from 'pixi.js';
	import type { Root } from '$lib/types/mandatfordelning';
	import { BarChart, type ChartData } from '$lib/graph/BarChart';

	let canvasHost: HTMLDivElement;
	let data: Root | null = null;


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

			const textStyle = new TextStyle({
				fontFamily: 'Hard Compound',
				fontSize: 28,
				fill: 0xffffff,
				fontWeight: 'bold',
				stroke: { color: 0x000000, width: 6, join: 'round' }
			});

			// Top left corner
			const votesText = new Text({ text: '', style: textStyle });
			votesText.anchor.set(0, 0);
			votesText.x = 20;
			votesText.y = 20;

			// Top right corner
			const updateText = new Text({ text: '', style: textStyle });
			updateText.anchor.set(1, 0);
			updateText.x = app.screen.width - 20;
			updateText.y = 20;

			app.stage.addChild(votesText, updateText);

			let chart: BarChart | null = null;

			const fetchData = async () => {
				console.log('Fetching data...');
				const res = await fetch('/api/data');
				if (!res.ok) {
					throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
				}
				data = await res.json();
				console.log('Data fetched:', data);

				if (data) {
					votesText.text = `Räknade röster: ${data.valomrade.totaltAntalRoster.toLocaleString('sv-SE')}`;
					updateText.text = `Senaste uppdaterad: ${new Date(data.senasteUppdateringstid).toLocaleTimeString('sv-SE')}`;

					const chartData: ChartData[] = [];
					const backgroundData: ChartData[] = [];

					for (const party of data.valomrade.rostfordelning.rosterPaverkaMandat.partiRoster) {
						chartData.push({
							label: party.partiforkortning,
							value: party.andelRoster,
							color: Number(`0x${party.fargkod.substring(1)}`)
						});
						backgroundData.push({
							value: party.andelRosterForegaendeVal || 0,
							color: 0x000000 // Black color for background
						});

					}
					chartData.reverse();
					backgroundData.reverse();

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

					if (!chart) {
						// First fetch - create the chart
						chart = new BarChart(chartData, backgroundData);
						const totalWidth = chartData.length * (140 + 60) - 60;
						chart.x = (app.screen.width - totalWidth) / 2;
						chart.y = app.screen.height - 60; // 60px margin for labels below the baseline
						app.stage.addChild(chart);
					} else {
						// Later fetches - just update the values so they animate
						chart.updateChart(chartData.map((d) => d.value));
						chart.updateBackgroundChart(backgroundData.map((d) => d.value));
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
