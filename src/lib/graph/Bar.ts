import { Container, Graphics, Ticker } from "pixi.js";

export type BarProps = {
    height: number;
    width: number;
    maxValue: number; // ADDED: You need a max value to know how full the bar should be!
}

export type BarData = {
    value: number;
    color: number;
}

export class Bar extends Container {
    private fill_bar_graphics: Graphics;
    private bar_graphics: Graphics;
    private props: BarProps;
    private data: BarData;

    constructor(props: BarProps, data: BarData) {
        super();

        this.bar_graphics = new Graphics();
        this.addChild(this.bar_graphics);

        this.fill_bar_graphics = new Graphics();
        this.addChild(this.fill_bar_graphics);

        this.props = props;
        this.data = data;
        this.setUpBar();

        Ticker.shared.add(this.animate.bind(this));
    }

    private setUpBar() {
        this.bar_graphics.rect(0, 0, this.props.width, 1).fill(0xD3D3D3);
        this.bar_graphics.scale.y = this.props.height;

        this.fill_bar_graphics.rect(0, 0, this.props.width, 1).fill(this.data.color);

        const fillPercentage = Math.max(0, this.data.value) / this.props.maxValue;
        this.fill_bar_graphics.scale.y = -(this.props.height * fillPercentage);
        this.fill_bar_graphics.y = this.props.height;
    }

    update(data: BarData) {
        this.data = data;
    }

    animate() {
        const fillPercentage = Math.max(0, this.data.value) / this.props.maxValue;
        const targetScaleY = -(this.props.height * fillPercentage);

        this.fill_bar_graphics.scale.y += (targetScaleY - this.fill_bar_graphics.scale.y) * 0.1;

        if (Math.abs(targetScaleY - this.fill_bar_graphics.scale.y) < 0.001) {
            this.fill_bar_graphics.scale.y = targetScaleY;
        }
    }

    destroy(options?: any) {
        Ticker.shared.remove(this.animate.bind(this));
        super.destroy(options);
    }
}
