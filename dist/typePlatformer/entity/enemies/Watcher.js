import { Entity } from "../Entity.js";
export class Watcher extends Entity {
    constructor(healthcomponent, hitboxComponent) {
        super(healthcomponent, hitboxComponent);
        this.lockActionTime = 0;
    }
    update() {
        this.velocity = { x: 0, y: 0 };
        if (this.lockActionTime > 200) {
            const random1 = Math.random() * 100;
            const random2 = Math.random() * 100;
            if (random1 > 49) {
                this.direction = "up";
                this.velocity.y = -this.speed;
            }
            else {
                this.direction = "down";
                this.velocity.y = this.speed;
            }
            if (random2 > 49) {
                this.direction = "left";
                this.velocity.x = -this.speed;
            }
            else {
                this.direction = "right";
                this.velocity.x = this.speed;
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
