import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class Diamond extends Container {
    private diamondGraphics: Graphics;
    private labelText: Text;
    constructor(label: string, width: number, height: number, textStyle: TextStyle) {
        super();
        this.diamondGraphics = new Graphics();
        this.labelText = new Text({ style: textStyle });
        this.addChild(this.diamondGraphics, this.labelText);
        this.setUp(label, width, height);
    }

    private setUp(label: string, width: number, height: number) {
        this.diamondGraphics.poly([width / 2, 0, width, height / 2, width / 2, height, 0, height / 2])
        this.diamondGraphics.fill(0xFFD700)
        this.labelText.text = label;
        this.labelText.anchor.set(0.5);
        this.labelText.position.set(width / 2, height / 2);
        this.labelText.scale.set(1);
        const maxWidth = width * 0.65;
        const maxHeight = height * 0.65;
        if (this.labelText.width > maxWidth) {
            const ratio = maxWidth / this.labelText.width;
            this.labelText.scale.set(ratio);
        }

        if (this.labelText.height > maxHeight) {
            const ratio = maxHeight / this.labelText.height;
            this.labelText.scale.set(Math.min(this.labelText.scale.x, ratio));
        }
    }
}
