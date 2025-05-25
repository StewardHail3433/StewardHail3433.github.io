import { Entity } from "../Entity.js";
import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { Constants } from "../../utils/Constants.js";
import { Node } from "../../utils/pathfinding/Node.js";
import { Items } from "../../item/Items.js";

export class Watcher extends Entity {
    private lockActionTime:number = 51;
    constructor(healthcomponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthcomponent, hitboxComponent)
        this.speed = (Math.random() * 2 + 1) * 30;
        this.usingSlot.setItem(Items.SWORD_2, 1);
        this.usingTool = true;
    }

    public update() {
        if (!this.onPath && !this.atGoal) {
            if(this.lockActionTime > 50) {
                const random1 = Math.random() * 100;
                const random2 = Math.random() * 100;
                if (random1 < 33) {
                    this.direction = "up";
                    this.velocity.y = -this.speed;
                } else if(random1 < 66) {
                    this.direction = "down";
                    this.velocity.y = this.speed;
                } else {
                    this.velocity.y = 0;
                }

                if (random2 < 33) {
                    this.direction = "left";
                    this.velocity.x = -this.speed;
                } else if(random2 < 66) {
                    this.direction = "right";
                    this.velocity.x = this.speed;
                } else {
                    this.velocity.x = 0;
                }
                this.lockActionTime = 0;
                this.onPath = false;
                this.path =[];
            }
        } else {
            this.followPathAction()
        }
        this.lockActionTime++;
        super.update();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
        super.renderUsingItem(ctx)
    }
}