import { Entity } from "../Entity.js";
export class Watcher extends Entity {
    constructor(healthcomponent, hitboxComponent) {
        super(healthcomponent, hitboxComponent);
        this.lockActionTime = 0;
    }
    update() {
        if (this.lockActionTime > 200) {
            const random1 = Math.random() * 100;
            const random2 = Math.random() * 100;
            if (random1 < 33) {
                this.direction = "up";
                this.velocity.y = -this.speed;
            }
            else if (random1 < 66) {
                this.direction = "down";
                this.velocity.y = this.speed;
            }
            else {
                this.velocity.y = 0;
            }
            if (random2 < 33) {
                this.direction = "left";
                this.velocity.x = -this.speed;
            }
            else if (random2 < 66) {
                this.direction = "right";
                this.velocity.x = this.speed;
            }
            else {
                this.velocity.x = 0;
            }
            this.lockActionTime = 0;
        }
        this.lockActionTime++;
        super.update();
    }
    render(ctx) {
        super.render(ctx);
    }
}
