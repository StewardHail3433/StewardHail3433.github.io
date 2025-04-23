import { isInside } from "../../utils/Collisions.js";
import { Constants } from "../../utils/Constants.js";
import { UIComponentLabel } from "./UIComponentLabel.js";
export class UIComponentButton extends UIComponentLabel {
    constructor(canvas, hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden, text = "", textColor = { red: 0, green: 0, blue: 0, alpha: 1.0 }, fontSize = 8, textAlign = "left", hoverColor = color, hoverTextColor = textColor, clickColor = color, onTrue, onFalse, whileTrue, whileFalse) {
        super(hitbox, color, hidden, text, textColor, fontSize, textAlign);
        this.activeTouches = new Set();
        this.hoverColor = hoverColor;
        this.hoverTextColor = hoverTextColor;
        this.click = false;
        this.defaultColor = color;
        this.clickColor = clickColor;
        this.onTrue = onTrue;
        this.onFalse = onFalse;
        this.whileTrue = whileTrue;
        this.whileFalse = whileFalse;
        this.canvas = canvas;
        this.shouldOnTrue = false;
        this.shouldOnFalse = true;
        document.addEventListener("touchstart", (event) => this.handleTouchStart(event));
        document.addEventListener("touchmove", (event) => this.handleTouchMove(event));
        document.addEventListener("touchend", (event) => this.handleTouchEnd(event));
    }
    handleMouseDown() {
        if (Constants.INPUT_HANDLER.isMouseDown()) {
            var boxx = this.hitbox.x;
            var boxy = this.hitbox.y;
            if (this.parentComponent && !this.parentComponent.isHidden()) {
                boxx += this.parentComponent.getHitbox().x;
                boxy += this.parentComponent.getHitbox().y;
            }
            if (isInside(Constants.INPUT_HANDLER.getMousePosition(), Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }), this.scale)) {
                if (!this.click) {
                    this.shouldOnTrue = true;
                }
                this.click = true;
                this.color = this.clickColor;
            }
        }
    }
    handleMouseMove() {
        var boxx = this.hitbox.x;
        var boxy = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            boxx += this.parentComponent.getHitbox().x;
            boxy += this.parentComponent.getHitbox().y;
        }
        if (isInside(Constants.INPUT_HANDLER.getMousePosition(), Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }), this.scale)) {
            if (!Constants.INPUT_HANDLER.isMouseDown()) {
                this.color = this.hoverColor;
            }
            else {
                this.color = this.clickColor;
            }
        }
        else {
            if (this.click && this.activeTouches.size === 0) {
                this.color = this.defaultColor;
                this.click = false;
                this.shouldOnTrue = false;
                this.shouldOnFalse = true;
            }
            this.color = this.defaultColor;
        }
    }
    handleMouseUp() {
        if (!Constants.INPUT_HANDLER.isMouseDown()) {
            if (this.click && this.activeTouches.size === 0) {
                this.color = this.defaultColor;
                this.click = false;
                this.shouldOnTrue = false;
                this.shouldOnFalse = true;
            }
        }
    }
    handleTouchStart(event) {
        var changedTouches = event.changedTouches;
        var boxx = this.hitbox.x;
        var boxy = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            boxx += this.parentComponent.getHitbox().x;
            boxy += this.parentComponent.getHitbox().y;
        }
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            let x = touch.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
            let y = touch.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
            if (x >= 0 && y >= 0 && y <= Constants.CANVAS_HEIGHT * this.scale && x <= Constants.CANVAS_WIDTH * this.scale) {
                event.preventDefault();
                if (isInside({ x, y }, Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }), this.scale)) {
                    if (!this.activeTouches.size) {
                        this.shouldOnTrue = true;
                    }
                    this.click = true;
                    this.activeTouches.add(touch.identifier);
                    this.color = this.clickColor;
                }
            }
        }
    }
    handleTouchMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        var changedTouches = event.changedTouches;
        var boxx = this.hitbox.x;
        var boxy = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            boxx += this.parentComponent.getHitbox().x;
            boxy += this.parentComponent.getHitbox().y;
        }
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            let x = touch.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
            let y = touch.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
            if (x >= 0 && y >= 0 && y <= Constants.CANVAS_HEIGHT * this.scale && x <= Constants.CANVAS_WIDTH * this.scale) {
                event.preventDefault();
                if (isInside({ x, y }, Object.assign(Object.assign({}, this.hitbox), { x: boxx, y: boxy }), this.scale)) {
                    this.color = this.hoverColor;
                }
                else {
                    this.color = this.defaultColor;
                }
            }
        }
    }
    handleTouchEnd(event) {
        const rect = this.canvas.getBoundingClientRect();
        var changedTouches = event.changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            let x = touch.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
            let y = touch.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
            if (x >= 0 && y >= 0 && y <= Constants.CANVAS_HEIGHT * this.scale && x <= Constants.CANVAS_WIDTH * this.scale) {
                event.preventDefault();
            }
            if (this.activeTouches.has(touch.identifier)) {
                this.activeTouches.delete(touch.identifier);
            }
        }
        if (this.activeTouches.size === 0) {
            this.color = this.defaultColor;
            this.click = false;
            this.shouldOnTrue = false;
            this.shouldOnFalse = true;
        }
    }
    update(text = this.text) {
        this.handleMouseDown();
        this.handleMouseMove();
        this.handleMouseUp();
        super.update(text);
        this.click = this.activeTouches.size > 0 || this.click;
        if (!this.hidden) {
            if (this.click) {
                if (this.shouldOnTrue) {
                    if (this.onTrue) {
                        this.onTrue();
                        this.shouldOnTrue = false;
                    }
                }
                if (this.whileTrue) {
                    this.whileTrue();
                }
            }
            else {
                if (this.shouldOnFalse) {
                    if (this.onFalse) {
                        this.onFalse();
                        this.shouldOnFalse = false;
                    }
                }
                if (this.whileFalse) {
                    this.whileFalse();
                }
            }
        }
    }
    setOnTrue(action) {
        this.onTrue = action;
    }
    setOnFalse(action) {
        this.onFalse = action;
    }
    setWhileTrue(action) {
        this.whileTrue = action;
    }
    setWhileFalse(action) {
        this.whileFalse = action;
    }
    render(ctx) {
        if (this.hidden) {
            return;
        }
        super.render(ctx);
    }
}
