import { UIComponent } from "./UIComponent.js";

export class UIComponentLabel extends UIComponent {
    protected text: string;
    protected fontSize: number;
    protected textColor: {red: number, green: number, blue: number, alpha?: number};
    protected textAlign: CanvasTextAlign;
    constructor(
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        text: string = "", 
        textColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        fontSize: number = 8,
        textAlign: CanvasTextAlign = "left") {
        super(hitbox, color, hidden);
        this.text = text;
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
    }

    public render(ctx: CanvasRenderingContext2D, element?: UIComponent) {
        if(this.hidden) {
            return;
        }
        super.render(ctx, element);
        var x: number = this.hitbox.x; 
        var y: number = this.hitbox.y;
        if(element && !element.isHidden()) {
            x += element.getHitbox().x;
            y += element.getHitbox().y;
        }

        ctx.textAlign = this.textAlign;
        if(this.textColor.alpha) {
            ctx.fillStyle = "rgba(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ", " + this.textColor.alpha + ")";
        } else {
            ctx.fillStyle = "rgb(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ")";
        }
        ctx.font = this.fontSize + "px serif";
        let lines = this.text.split("\n"); // Split by actual newlines first
        let lineHeight = this.fontSize * 1.2; 
        y -= 3;

        for (let i = 0; i < lines.length; i++) {
            let words = lines[i].split(" "); // Split line into words for wrapping
            let line = "";

            for (let word of words) {
                let testLine = line.length === 0 ? word : line + " " + word;
                let testWidth = ctx.measureText(testLine).width;

                if (testWidth > this.hitbox.width && line.length > 0) {
                    // Draw current line and move down
                    if(this.textAlign === "left") {
                        ctx.fillText(line, x , y+lineHeight );
                    } else if(this.textAlign === "center") {
                        ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
                    } else {
                        ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
                    }
                    line = word;
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }

            if(this.textAlign === "left") {
                ctx.fillText(line, x , y+lineHeight );
            } else if(this.textAlign === "center") {
                ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            } else {
                ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            }
            y += lineHeight; // Move down for next full line (after \n)
        }
    }

    public update(text: string = this.text) {
        this.text = text;
    }
}