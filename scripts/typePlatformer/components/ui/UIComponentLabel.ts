import { UIComponent } from "./UIComponent.js";

export class UIComponentLabel extends UIComponent {
    protected text: string;
    protected fontSize: number;
    protected textColor: {red: number, green: number, blue: number, alpha?: number};

    constructor(
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        text: string = "", 
        textColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        fontSize: number = 8) {
        super(hitbox, color, hidden);
        this.text = text;
        this.textColor = textColor;
        this.fontSize = fontSize;
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
        ctx.textAlign = "center";
        if(this.textColor.alpha) {
            ctx.fillStyle = "rgba(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ", " + this.textColor.alpha + ")";
        } else {
            ctx.fillStyle = "rgb(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ")";
        }
        ctx.font = this.fontSize + "px serif";
        let words = this.text.split(" ");
        let line = "";
        let lineHeight = this.fontSize * 1.2; 
        y -= 3;
        // Start from top of hitbox

        for (let i = 0; i < words.length; i++) { 
            let testLine;
            if (line === '') { // first word
                testLine = words[i];
            } else { // add words
                testLine = line + ' ' + words[i];
            }

            let testWidth = ctx.measureText(testLine).width;

            if (testWidth > this.hitbox.width && line !== '') {
                ctx.fillText(line, x+this.hitbox.width/2, y+this.hitbox.height/2);
                line = words[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        ctx.fillText(line, x+this.hitbox.width/2, y+this.hitbox.height/2); 
    }

    public update(text: string = this.text) {
        this.text = text;
    }
}