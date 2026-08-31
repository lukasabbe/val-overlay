import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";

export type MandatBarProps = {
  height: number;
  width: number;
  maxValue: number;
  leftValue: number;
  leftColor: number;
  leftLabel: string;
  rightValue: number;
  rightColor: number;
  rightLabel: string;
  textStyle?: TextStyle;
}

export class MandatBar extends Container {
  private leftFill: Graphics;
  private rightFill: Graphics;
  private middleLine: Graphics;
  private middleText: Text;
  private leftLabelText: Text;
  private rightLabelText: Text;

  private props: MandatBarProps;
  private currentLeftValue = 0;
  private currentRightValue = 0;

  constructor(props: MandatBarProps) {
    super();
    this.props = props;

    this.leftFill = new Graphics();
    this.rightFill = new Graphics();
    this.middleLine = new Graphics();
    this.middleText = new Text();
    this.leftLabelText = new Text();
    this.rightLabelText = new Text();

    this.addChild(
      this.leftFill,
      this.rightFill,
      this.middleLine,
      this.middleText,
      this.leftLabelText,
      this.rightLabelText
    );

    this.setUp();
    Ticker.shared.add(this.animate.bind(this));
  }

  private setUp() {
    const { height, width, maxValue, leftColor, rightColor, leftLabel, rightLabel } = this.props;
    const textStyle = this.props.textStyle ?? new TextStyle({
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffffff,
      fontWeight: "bold",
      stroke: { color: 0x000000, width: 3, join: "round" },
    });

    // Left fill grows from the left edge
    this.leftFill.rect(0, 0, 1, height).fill(leftColor);
    this.leftFill.scale.x = 0;

    // Right fill starts where the left fill ends and grows rightward (no gap)
    this.rightFill.rect(0, 0, 1, height).fill(rightColor);
    this.rightFill.x = 0;
    this.rightFill.scale.x = 0;

    // Clear reference line at half maxValue (full bar height with black outline)
    const middleX = width / 2;
    this.middleLine.moveTo(middleX, -5).lineTo(middleX, height + 5).stroke({ color: 0x000000, width: 4, join: "round" });
    this.middleLine.moveTo(middleX, -3).lineTo(middleX, height + 3).stroke({ color: 0xffffff, width: 2, join: "round" });

    // Middle text below the bar
    this.middleText.text = `${maxValue / 2}`;
    this.middleText.style = new TextStyle({ ...textStyle, fontSize: 12 });
    this.middleText.anchor.set(0.5, 0);
    this.middleText.x = middleX;
    this.middleText.y = height + 5;

    // Labels sit inside their respective colored segment
    this.leftLabelText.text = leftLabel;
    this.leftLabelText.style = textStyle;
    this.leftLabelText.anchor.set(0.5);
    this.leftLabelText.y = height / 2;

    this.rightLabelText.text = rightLabel;
    this.rightLabelText.style = textStyle;
    this.rightLabelText.anchor.set(0.5);
    this.rightLabelText.y = height / 2;

    this.currentLeftValue = 0;
    this.currentRightValue = 0;
  }

  public update(props: Partial<MandatBarProps>) {
    Object.assign(this.props, props);
    if (props.leftLabel) this.leftLabelText.text = props.leftLabel;
    if (props.rightLabel) this.rightLabelText.text = props.rightLabel;
  }

  private animate() {
    const { width, maxValue, leftValue, rightValue } = this.props;

    const leftTarget = Math.max(0, leftValue) / maxValue;
    const rightTarget = Math.max(0, rightValue) / maxValue;

    this.currentLeftValue += (leftTarget - this.currentLeftValue) * 0.1;
    this.currentRightValue += (rightTarget - this.currentRightValue) * 0.1;

    if (Math.abs(leftTarget - this.currentLeftValue) < 0.001) this.currentLeftValue = leftTarget;
    if (Math.abs(rightTarget - this.currentRightValue) < 0.001) this.currentRightValue = rightTarget;

    const leftWidth = width * this.currentLeftValue;
    const rightWidth = width * this.currentRightValue;

    // Left fill grows rightward from x=0
    this.leftFill.scale.x = leftWidth;

    // Right fill sits adjacent to the left fill and grows rightward (no gap)
    this.rightFill.x = leftWidth;
    this.rightFill.scale.x = rightWidth;

    // Keep labels centered inside their respective colored segment
    this.leftLabelText.x = leftWidth / 2;
    this.rightLabelText.x = leftWidth + rightWidth / 2;
  }

  destroy(options?: any) {
    Ticker.shared.remove(this.animate.bind(this));
    super.destroy(options);
  }
}