import { Entity } from "../Enity.js";
export class Player extends Entity {
    constructor(name, healthComponent, hitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.keys = {};
        this.name = name;
        this.setControls();
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
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
            this.velocity.y = -this.speed;
        }
        if (this.keys[this.controls.down]) {
            this.velocity.y = this.speed;
        }
        if (this.keys[this.controls.left]) {
            this.velocity.x = -this.speed;
        }
        if (this.keys[this.controls.right]) {
            this.velocity.x = this.speed;
        }
        if (this.keys[this.controls.debug]) {
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, this.hitboxComponent.getHitbox()), { x: 200 }));
        }
        super.update(dt);
    }
    getControls() {
        return this.controls;
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
}
