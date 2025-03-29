import { isInside } from "../../utils/Collisions.js";
import { UIComponentLabel } from "./UIComponentLabel.js";
export class UIComponentTextbox extends UIComponentLabel {
    constructor(canvas, hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden, placeHolder = "Type Here...", textColor = { red: 0, green: 0, blue: 0, alpha: 1.0 }, fontSize = 8, textAlign = "left", lockTextHeight = false, onSubmit) {
        super(hitbox, color, hidden, placeHolder, textColor, fontSize, textAlign, lockTextHeight);
        this.canvas = canvas;
        this.placeholder = placeHolder;
        this.text = "";
        this.boxFocus = false;
        this.handleMouseDown = this.handleMouseDown.bind(this); // bind this class to the methods
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("touchstart", this.handleTouchStart);
        this.onSubmit = onSubmit;
    }
    handleMouseDown(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        var boxx = this.hitbox.x;
        var boxy = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            boxx += this.parentComponent.getHitbox().x;
            boxy += this.parentComponent.getHitbox().y;
        }
        if (isInside({ x, y }, Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }))) {
            this.startTextElement();
        }
        else {
            this.boxFocus = false;
            if (!this.text.trim()) {
                this.text = this.placeholder;
            }
            this.removeTextElement();
        }
    }
    handleTouchStart(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        let x = event.touches[0].clientX - rect.left;
        let y = event.touches[0].clientY - rect.top;
        var boxx = this.hitbox.x;
        var boxy = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            boxx += this.parentComponent.getHitbox().x;
            boxy += this.parentComponent.getHitbox().y;
        }
        if (isInside({ x, y }, Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }))) {
            this.startTextElement();
        }
        else {
            this.boxFocus = false;
            if (!this.text.trim()) {
                this.text = this.placeholder;
            }
            this.removeTextElement();
        }
    }
    handleKeyDown(event) {
        if (!this.inputElement) {
            return;
        }
        event.stopPropagation();
        this.text = this.inputElement.value;
        if (event.key === "Enter") {
            this.boxFocus = false;
            this.removeTextElement();
            if (this.onSubmit) {
                this.onSubmit();
            }
            return;
        }
    }
    startTextElement() {
        if (this.inputElement)
            return; // Prevent creating multiple input elements
        this.inputElement = document.createElement("input");
        this.inputElement.type = "text";
        this.inputElement.style.position = "absolute";
        var x = this.hitbox.x;
        var y = this.hitbox.y;
        if (this.parentComponent) {
            x += this.parentComponent.getHitbox().x;
            y += this.parentComponent.getHitbox().y;
        }
        const rect = this.canvas.getBoundingClientRect();
        this.inputElement.style.left = rect.left + x + "px";
        this.inputElement.style.top = rect.top + y + "px";
        this.inputElement.style.width = this.hitbox.width + "px";
        this.inputElement.style.height = this.hitbox.height + "px";
        this.inputElement.style.opacity = "1.0"; // bugged right now so show showing
        this.inputElement.style.pointerEvents = "auto";
        this.inputElement.placeholder = this.placeholder;
        this.inputElement.value = this.text;
        this.inputElement.id = "textboxCanvas";
        document.body.appendChild(this.inputElement);
        this.inputElement.focus();
        this.boxFocus = true;
        this.text = "";
        this.inputElement.value = this.text;
        this.inputElement.addEventListener("keydown", this.handleKeyDown);
    }
    removeTextElement() {
        if (this.inputElement) {
            this.inputElement.removeEventListener("keydown", this.handleKeyDown);
            document.body.removeChild(this.inputElement);
            this.inputElement = undefined;
        }
    }
}
