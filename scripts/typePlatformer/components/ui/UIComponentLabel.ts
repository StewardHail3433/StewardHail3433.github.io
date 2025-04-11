import { UIComponent } from "./UIComponent.js";

export class UIComponentLabel extends UIComponent {
    protected text: string;
    protected fontSize: number;
    protected textColor: {red: number, green: number, blue: number, alpha?: number};
    protected textAlign: CanvasTextAlign;
    private lockTextHeight = false;
    
    constructor(
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        text: string = "", 
        textColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        fontSize: number = 8,
        textAlign: CanvasTextAlign = "left",
        lockTextHeight = false) {
        super(hitbox, color, hidden);
        this.text = text;
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
        this.lockTextHeight = lockTextHeight
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(this.hidden) {
            return;
        }
        super.render(ctx);
        var x: number = this.hitbox.x; 
        var y: number = this.hitbox.y;
        if(this.parentComponent) {
            x += this.parentComponent.getHitbox().x;
            y += this.parentComponent.getHitbox().y;
        }

        ctx.textAlign = this.textAlign;
        if(this.textColor.alpha) {
            ctx.fillStyle = "rgba(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ", " + this.textColor.alpha + ")";
        } else {
            ctx.fillStyle = "rgb(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ")";
        }
        ctx.font = this.fontSize + "px serif";

        //AI I want to redo
        let lines: string[] = [];
        let paragraphs = this.text.split("\n"); // Preserve explicit newlines
        let lineHeight = this.fontSize * 1.2;
        let maxLines = Math.round(this.hitbox.height / lineHeight);

        for (let paragraph of paragraphs) {
            let words = paragraph.split(" ");
            let currentLine = "";

            for (let word of words) {
                let testLine = currentLine.length === 0 ? word : currentLine + " " + word;
                let testWidth = ctx.measureText(testLine).width;

                if (testWidth > this.hitbox.width && currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                lines.push(currentLine);
            }
        }

        // Remove excess lines if lockTextHeight is enabled
        if (this.lockTextHeight && lines.length > maxLines) {
            lines = lines.slice(lines.length - maxLines);
        }



        // Render text line by line
        y -= 3;

        for (let i = 0; i < lines.length; i++) {

            if(this.textAlign === "left") {
                ctx.fillText(lines[i], x , y+lineHeight );
            } else if(this.textAlign === "center") {
                ctx.fillText(lines[i], x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            } else {
                ctx.fillText(lines[i], x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            }
            y += lineHeight; // Move down for next full line (after \n)
        }
    }

    public update(text: string = this.text) {
        this.text = text;
    }

    public getText(): string {
        return this.text;
    }

    public updatePosition(scale: number) {
        super.updatePosition(scale)
    }
}