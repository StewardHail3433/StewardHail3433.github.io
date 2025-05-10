import { Entity } from "../Entity.js";
import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { Constants } from "../../utils/Constants.js";
import { Node } from "../../utils/pathfinding/Node.js";

export class Watcher extends Entity {
    private lockActionTime:number = 51;
    private tp = {x:0, y:0};
    private path: Node[] = [];
    private onPath: boolean = false;
    private atGoal: boolean = false;
    private pathTime: number = 0;
    constructor(healthcomponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthcomponent, hitboxComponent)
        this.speed = (Math.random() * 2 + 1) * 30;
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
            if (this.onPath && this.path.length > 0) {
                if(this.pathTime < 200) {
                    const targetNode = this.path[0];
                    const hitbox = this.getHitboxComponent().getHitbox();
                    const targetCenterX = targetNode.getPos().x * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                    const targetCenterY = targetNode.getPos().y * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                    const dx = targetCenterX - (hitbox.x + hitbox.width / 2);
                    const dy = targetCenterY - (hitbox.y + hitbox.height / 2);
                    if (Math.abs(dx) >= 1) {
                        this.velocity.x = Math.sign(dx) * this.speed;
                        this.velocity.y = 0;
                    } else if (Math.abs(dy) >= 1) {
                        this.velocity.y = Math.sign(dy) * this.speed;
                        this.velocity.x = 0;
                    } else {
                        this.hitboxComponent.setHitbox({...hitbox,
                            x: targetCenterX - hitbox.width / 2,
                            y: targetCenterY - hitbox.height / 2}); 

                        this.path.shift();
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                    }

                    this.pathTime++;

                    if(this.path.length == 0) {
                        this.onPath = false;
                        this.atGoal = true;
                        console.log("end");
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                        this.pathTime = 0;
                    } else {
                        this.atGoal = false;
                    }
                } else {
                    this.onPath = false;
                    this.pathTime = 0;
                    this.path = [];
                }
            }
        }
        this.lockActionTime++;
        super.update();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
    }

    public setTargetPt(pt: {x:number,  y:number}) {
        this.tp = pt;
    }

    public setPath(path: Node[]) {
        this.path = path;
        if (this.path.length > 0) {
            this.onPath = true;

            if (this.path.length > 1) {
                const targetNode = this.path[1];
                const hitbox = this.getHitboxComponent().getHitbox();
                const targetCenterX = targetNode.getPos().x * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                const targetCenterY = targetNode.getPos().y * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                const dx = targetCenterX - (hitbox.x + hitbox.width / 2);
                const dy = targetCenterY - (hitbox.y + hitbox.height / 2);
                if (Math.sign(dx) == Math.sign(this.velocity.x) && this.velocity.y == 0) {
                    this.path.shift();
                }  else if (Math.sign(dy) == Math.sign(this.velocity.y) && this.velocity.x == 0) {
                    this.path.shift();
                } else {
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                }
            } else {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        } else {
            this.onPath = false;
        }
    }

    public getPath() {
        return this.path;
    }
}