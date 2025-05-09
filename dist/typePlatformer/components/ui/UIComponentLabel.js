import { UIComponent } from "./UIComponent.js";
export class UIComponentLabel extends UIComponent {
    constructor(hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden, text = "", textColor = { red: 0, green: 0, blue: 0, alpha: 1.0 }, fontSize = 8, textAlign = "left", lockTextHeight = false) {
        super(hitbox, color, hidden);
        this.lockTextHeight = false;
        this.text = text;
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
        this.lockTextHeight = lockTextHeight;
    }
    render(ctx) {
        if (this.hidden) {
            return;
        }
        super.render(ctx);
        var x = this.hitbox.x;
        var y = this.hitbox.y;
        if (this.parentComponent) {
            const parentComponentHitbox = this.parentComponent.getHitbox();
            x += parentComponentHitbox.x;
            y += parentComponentHitbox.y;
        }
        ctx.textAlign = this.textAlign;
        if (this.textColor.alpha) {
            ctx.fillStyle = "rgba(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ", " + this.textColor.alpha + ")";
        }
        else {
            ctx.fillStyle = "rgb(" + this.textColor.red + "," + this.textColor.green + "," + this.textColor.blue + ")";
        }
        ctx.font = this.fontSize + "px serif";
        //AI I want to redo
        let lines = [];
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
                }
                else {
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
            const line = lines[i];
            if (this.textAlign === "left") {
                ctx.fillText(line, x, y + lineHeight);
            }
            else if (this.textAlign === "center") {
                ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            }
            else {
                ctx.fillText(line, x + this.hitbox.width / 2, y + this.hitbox.height / 2);
            }
            y += lineHeight; // Move down for next full line (after \n)
        }
    }
    update(text = this.text) {
        this.text = text;
    }
    getText() {
        return this.text;
    }
}
