import { Entity } from "../Entity.js";
import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";

export class Watcher extends Entity {
    private lockActionTime:number = 0;
    constructor(healthcomponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthcomponent, hitboxComponent)
    }

    public update(): void {
        this.velocity = {x:0, y:0};
        if(this.lockActionTime > 200) {
            const random1 = Math.random() * 100;
            const random2 = Math.random() * 100;
            if (random1 > 49) {
                this.direction = "up";
                this.velocity.y = -this.speed;
            } else {
                this.direction = "down";
                this.velocity.y = this.speed;
            }

            if (random2 > 49) {
                this.direction = "left";
                this.velocity.x = -this.speed;
            } else {
                this.direction = "right";
                this.velocity.x = this.speed;
            }
            this.lockActionTime = 0;
        }
        this.lockActionTime++;
        super.update()
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }
}