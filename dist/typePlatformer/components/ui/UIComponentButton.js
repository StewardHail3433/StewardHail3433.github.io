import { UIComponentLabel } from "./UIComponentLabel.js";
export class UIComponentButton extends UIComponentLabel {
    constructor(canvas, hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden, text = "", textColor = { red: 0, green: 0, blue: 0, alpha: 1.0 }, fontSize = 8, hoverColor = color, hoverTextColor = textColor, clickColor = color, action) {
        super(hitbox, color, hidden, text, textColor, fontSize);
        this.hoverColor = hoverColor;
        this.hoverTextColor = hoverTextColor;
        this.click = false;
        this.defaultColor = color;
        this.clickColor = clickColor;
        this.action = action;
        this.canvas = canvas;
        this.shouldAction = false;
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
    }
    handleMouseDown(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x > this.hitbox.x && x < this.hitbox.x + this.hitbox.width
            && y > this.hitbox.y && y < this.hitbox.y + this.hitbox.height) {
            if (!this.click) {
                this.shouldAction = true;
            }
            this.click = true;
            this.color = this.clickColor;
        }
    }
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x > this.hitbox.x && x < this.hitbox.x + this.hitbox.width
            && y > this.hitbox.y && y < this.hitbox.y + this.hitbox.height) {
            this.color = this.hoverColor;
        }
        else {
            this.color = this.defaultColor;
        }
    }
    handleMouseUp(event) {
        if (this.click) {
            this.color = this.defaultColor;
            this.click = false;
            this.shouldAction = false;
        }
    }
    update(text = this.text) {
        super.update(text);
        if (this.click && this.shouldAction) {
            if (this.action) {
                this.action();
                this.shouldAction = false;
            }
        }
    }
    setAction(action) {
        this.action = action;
    }
}
