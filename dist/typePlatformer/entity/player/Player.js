import { UIComponentButton } from "../../components/ui/UIComponentButton.js";
import { Entity } from "../Enity.js";
export class Player extends Entity {
    constructor(name, healthComponent, hitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.keys = {};
        this.touchMode = false;
        this.movementButtons = [new UIComponentButton(document.getElementById("gameCanvas"), { x: 10, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "<-", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.left] = false;
            }, () => {
                this.keys[this.controls.left] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 55, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "v", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.down] = false;
            }, () => {
                this.keys[this.controls.down] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 100, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "->", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.right] = false;
            }, () => {
                this.keys[this.controls.right] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 55, y: 225, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "^", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.up] = false;
            }, () => {
                this.keys[this.controls.up] = true;
            })];
        this.name = name;
        this.setControls();
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
        this.setToTouch();
    }
    setControls(controls = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        jump: ' ',
        debug: 't',
    }) {
        this.controls = controls;
    }
    update(dt) {
        this.velocity = { x: 0, y: 0 };
        if (this.keys[this.controls.up]) {
            this.direction = "up";
            this.velocity.y = -this.speed;
        }
        if (this.keys[this.controls.down]) {
            this.direction = "down";
            this.velocity.y = this.speed;
        }
        if (this.keys[this.controls.left]) {
            this.direction = "left";
            this.velocity.x = -this.speed;
        }
        if (this.keys[this.controls.right]) {
            this.direction = "right";
            this.velocity.x = this.speed;
        }
        if (this.keys[this.controls.debug]) {
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, this.hitboxComponent.getHitbox()), { x: 200 }));
        }
        if (this.touchMode) {
            for (var button of this.movementButtons) {
                button.show();
            }
        }
        else {
            for (var button of this.movementButtons) {
                button.hide();
            }
        }
        super.update(dt);
    }
    getControls() {
        return Object.assign({}, this.controls);
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    isMoving() {
        return this.velocity.x != 0 || this.velocity.y != 0;
    }
    getMovementButton(canvas) {
        return this.movementButtons;
    }
    setToKeyboard() {
        this.touchMode = false;
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
    }
    setToTouch() {
        document.removeEventListener("keydown", () => { });
        document.removeEventListener("keyup", () => { });
        this.touchMode = true;
    }
    getTouchMode() {
        return this.touchMode;
    }
}
