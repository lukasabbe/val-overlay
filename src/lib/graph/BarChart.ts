import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";

export type ChartData = {
  label?: string;
  value: number;
  color: number;
};

export class BarChart extends Container {
  private bars: Graphics[] = [];
  private titles: Text[] = [];
  private prosentageText: Text[] = [];
  private values: number[] = [];
  private targetValues: number[] = [];
  private backgroundBars: Graphics[] = [];
  private backgroundValues: number[] = [];
  private backgroundTargetValues: number[] = [];

  private maxChartHeight = 600;
  private barWidth = 140;
  private spacing = 60;
  private maxValue = 100;

  constructor(data: ChartData[], backgroundData?: ChartData[]) {
    super();
    // Values are shares that sum to 100 across all bars,
    // so scale relative to the largest value instead of an absolute 100
    this.maxValue = Math.max(1, ...data.map((d) => d.value), ...(backgroundData ?? []).map((d) => d.value));
    if (backgroundData?.length) {
      this.setUpBackgroundChart(backgroundData);
    }
    this.setUpChart(data);
    Ticker.shared.add(this.animate.bind(this))
  }

  // Must run before setUpChart so the background bars render behind
  private setUpBackgroundChart(data: ChartData[]) {
    // Narrower than the main bar, shifted right so a sliver
    // peeks out on the right side like a shadow
    const leftInset = 30;
    const peek = 15;

    data.forEach((item, index) => {
      const xPos = index * (this.barWidth + this.spacing) + leftInset;
      const bar = new Graphics();
      // Negative y so bars grow upward from the baseline
      bar.rect(0, -this.maxChartHeight, this.barWidth - leftInset + peek, this.maxChartHeight);
      bar.fill({ color: item.color, alpha: 0.4 });
      bar.x = xPos;
      bar.y = 0;
      bar.scale.y = 0;
      this.backgroundBars.push(bar);
      this.addChild(bar);

      this.backgroundValues.push(0);
      this.backgroundTargetValues.push(item.value)
    });
  }

  private setUpChart(data: ChartData[]) {
    const textStyle = new TextStyle({
      fontFamily: "Hard Compound",
      fontSize: 32,
      fill: 0xffffff,
      fontWeight: "bold",
      stroke: { color: 0x000000, width: 6, join: "round" },
    })

    data.forEach((item, index) => {
      const xPos = index * (this.barWidth + this.spacing);
      const bar = new Graphics();
      // Negative y so bars grow upward from the baseline
      bar.rect(0, -this.maxChartHeight, this.barWidth, this.maxChartHeight);
      bar.fill(item.color);
      bar.x = xPos;
      bar.y = 0;
      bar.scale.y = 0;
      this.bars.push(bar);
      this.addChild(bar);

      const valueText = new Text({ text: `${item.value}%`, style: textStyle });
      valueText.anchor.set(0.5, 1);
      valueText.x = xPos + this.barWidth / 2;
      valueText.y = -10;
      this.prosentageText.push(valueText);
      this.addChild(valueText)

      const titleText = new Text({ text: item.label ?? "", style: textStyle });
      titleText.anchor.set(0.5, 0);
      titleText.x = xPos + this.barWidth / 2;
      titleText.y = 15;
      this.titles.push(titleText);
      this.addChild(titleText);

      this.values.push(0);
      this.targetValues.push(item.value)

    });
  }
  public updateChart(newValues: number[]) {
    this.targetValues = newValues;
    this.maxValue = Math.max(1, ...newValues, ...this.backgroundTargetValues);
  }

  public updateBackgroundChart(newValues: number[]) {
    this.backgroundTargetValues = newValues;
    this.maxValue = Math.max(1, ...newValues, ...this.targetValues);
  }

  public animate() {
    for (let i = 0; i < this.targetValues.length; i++) {
      const target = this.targetValues[i];
      const current = this.values[i];

      const newCurrent = current + (target - current) * 0.1;
      this.values[i] = newCurrent;

      const heightPercent = newCurrent / this.maxValue;

      this.bars[i].scale.y = heightPercent;

      this.prosentageText[i].y = -(this.maxChartHeight * heightPercent) - 10;
      this.prosentageText[i].text = `${newCurrent.toFixed(1)}%`;
    }

    for (let i = 0; i < this.backgroundTargetValues.length; i++) {
      const target = this.backgroundTargetValues[i];
      const current = this.backgroundValues[i];

      const newCurrent = current + (target - current) * 0.1;
      this.backgroundValues[i] = newCurrent;

      this.backgroundBars[i].scale.y = newCurrent / this.maxValue;
    }
  }
}
