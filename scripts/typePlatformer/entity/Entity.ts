import { normalize } from "path";
import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Node } from "../utils/pathfinding/Node.js";
import { Slot } from "../inventory/Slot.js";
import { Item } from "../item/Item.js";
import { ToolItem } from "../item/tools/ToolItem.js";
import { rectCorners } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { drawRoatatedImage } from "../utils/ImageManipulation.js";

export class Entity {
    protected healthComponent: HealthComponent;
    protected hitboxComponent: HitboxComponent;
    protected velocity = { x: 0, y: 0 };
    protected inputVel = {x: 0, y: 0};
    protected externalForceVel = {x: 0, y: 0};
    protected speed: number = 120;
    protected direction: string = "down";
    protected layer = 0;
    protected toolHitbox: {pts: number[][], angle: number} = {pts: [], angle: -90};
    protected usingSlot = new Slot();
    private lastDirection = "down";
    protected directionChanged = false;
    protected tp = {x:0, y:0};
    protected path: Node[] = [];
    protected onPath: boolean = false;
    protected atGoal: boolean = false;
    protected pathTime: number = 0;
    protected usingTool: boolean = false;
    protected type = "unknown";


    constructor(healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }

    public update() {

        // https://medium.com/@jordantkay/understanding-velocity-in-game-development-and-unity-518192655456

        let dist = Math.sqrt(this.inputVel.x * this.inputVel.x + this.inputVel.y * this.inputVel.y); 

        if (dist > 0) {
            // normalize for dia
            this.inputVel.x = Math.abs(this.inputVel.x) * (this.inputVel.x / dist);
            this.inputVel.y = Math.abs(this.inputVel.y) * (this.inputVel.y / dist);
        } else {
            this.inputVel.x = 0;
            this.inputVel.y = 0;
        }

        this.velocity.x = this.inputVel.x + this.externalForceVel.x;
        this.velocity.y = this.inputVel.y + this.externalForceVel.y;

        this.externalForceVel.x *= 0.9;
        this.externalForceVel.y *= 0.9;

        if(this.externalForceVel.x < 0.1) {
            this.externalForceVel.x = 0;
        }
        if(this.externalForceVel.y < 0.1) {
            this.externalForceVel.y = 0;
        }

        this.updateDirection()
        this.updateToolItem(this.usingSlot.getItem())
    }

    private updateDirection() {
        this.lastDirection = this.direction
        if(Math.sign(this.velocity.y) == -1) {
            this.direction = "up";
        }
        if(Math.sign(this.velocity.y) == 1) {
            this.direction = "down";
        }
        if(Math.sign(this.velocity.x) == 1) {
            this.direction = "right";
        }
        if(Math.sign(this.velocity.x) == -1) {
            this.direction = "left";
        }
        if(!this.directionChanged && this.direction != this.lastDirection) {
            this.directionChanged = true;
        } else {
            this.directionChanged = false;
        }
    }

    protected updateToolItem(item: Item) {
        if(item instanceof ToolItem) {
            const tool = item as ToolItem;
            const playerHitbox = this.hitboxComponent.getHitbox()
            let playerCenterX = playerHitbox.x + playerHitbox.width/2;
            let playerCenterY = playerHitbox.y + playerHitbox.height/2;
            //maybe
            // switch(this.direction) {
            //     case "down":
            //         playerCenterX += 5;
            //         playerCenterY += 3;
            //         break;
            //     case "up":
            //         playerCenterX -= 6;
            //         playerCenterY += 3;
            //         break;
            //     case "left":
            //         playerCenterX += 3;
            //         playerCenterY += 2;
            //         break;
            //     case "right":
            //         playerCenterX += 3;
            //         playerCenterY += 2;
            //         break;
            // }

            this.toolHitbox.pts = rectCorners({...tool.getHitbox(), x: playerCenterX - tool.getHitbox().width/2, y: playerCenterY - tool.getHitbox().height});

            const startAngle = this.getDirectionAsAngle() - tool.getSwingAngleSettings().totalRotationAmount / 2;
            const endAngle = this.getDirectionAsAngle() + tool.getSwingAngleSettings().totalRotationAmount / 2;

            this.toolHitbox.angle += tool.getSwingAngleSettings().step;

            if (this.toolHitbox.angle > endAngle) {
                this.toolHitbox.angle = startAngle;
            }

            // https://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
            for(let i = 0; i < this.toolHitbox.pts.length; i++) {
                const originalX = this.toolHitbox.pts[i][0];
                const originalY = this.toolHitbox.pts[i][1];
                this.toolHitbox.pts[i] = [Math.cos(this.toolHitbox.angle*(Math.PI/180)) * (originalX-playerCenterX) - Math.sin(this.toolHitbox.angle*(Math.PI/180)) * (originalY-playerCenterY) + playerCenterX,
                                Math.sin(this.toolHitbox.angle*(Math.PI/180)) * (originalX-playerCenterX) + Math.cos(this.toolHitbox.angle*(Math.PI/180)) * (originalY-playerCenterY) + playerCenterY]
            }
        }
    }

    protected getDirectionAsAngle() {
        return (this.direction == "right" ? 90 : (this.direction == "down" ? 180 : (this.direction == "left" ? 270 : 0)));
    }

    public render(ctx: CanvasRenderingContext2D) {
        const hitbox = this.hitboxComponent.getHitbox();
        const color = this.hitboxComponent.getColor();
        ctx.fillStyle = ("rgb(" + color.red.toString() +","+ color.green.toString() + "," + color.blue.toString() +")");
        ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    protected renderUsingItem(ctx: CanvasRenderingContext2D) {
    
            if(this.usingTool && this.usingSlot.getItem() instanceof ToolItem) {
    
                ctx.strokeStyle = "red";
                ctx.lineWidth = 0.5;
    
                if(Constants.INPUT_HANDLER.checkControlToggle("F3") && Constants.INPUT_HANDLER.checkControlToggle("b")) {
                    ctx.moveTo(this.toolHitbox.pts[0][0], this.toolHitbox.pts[0][1]);
                    ctx.beginPath()
                    for(let i = 0; i < this.toolHitbox.pts.length; i++) {
                        ctx.lineTo(this.toolHitbox.pts[i][0], this.toolHitbox.pts[i][1])
                    }
                    
                    ctx.lineTo(this.toolHitbox.pts[0][0], this.toolHitbox.pts[0][1])
                    ctx.closePath()
                    ctx.stroke()
                }
    
                if(this.toolHitbox.pts[0]) drawRoatatedImage(ctx, this.usingSlot.getItem().getImage()!, {x: this.toolHitbox.pts[0][0], y: this.toolHitbox.pts[0][1]}, this.toolHitbox.angle * (Math.PI/180))
            }
    }

    public getHitboxComponent(): HitboxComponent {
        return this.hitboxComponent;
    }

    public getDirection(): string {
        return this.direction;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public getVelocity(): {x: number, y:number} {
        return this.velocity;
    }

    public setVelocity(vel: {x: number, y:number}) {
        this.velocity = vel;
    }

    public getLayer(): number {
        return this.layer
    }

    protected followPathAction() {
        if (this.onPath && this.path.length > 0) {
            if(this.pathTime < 200) {
                const targetNode = this.path[0];
                const hitbox = this.getHitboxComponent().getHitbox();
                const targetCenterX = targetNode.getPos().x * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                const targetCenterY = targetNode.getPos().y * Constants.TILE_SIZE + Constants.TILE_SIZE / 2;
                const dx = targetCenterX - (hitbox.x + hitbox.width / 2);
                const dy = targetCenterY - (hitbox.y + hitbox.height / 2);
                if (Math.abs(dx) >= 1) {
                    this.inputVel.x = Math.sign(dx) * this.speed;
                    this.inputVel.y = 0;
                } else if (Math.abs(dy) >= 1) {
                    this.inputVel.y = Math.sign(dy) * this.speed;
                    this.inputVel.x = 0;
                } else {
                    this.hitboxComponent.setHitbox({...hitbox,
                        x: targetCenterX - hitbox.width / 2,
                        y: targetCenterY - hitbox.height / 2}); 

                    this.path.shift();
                    this.inputVel.x = 0;
                    this.inputVel.y = 0;
                }

                this.pathTime++;

                if(this.path.length == 0) {
                    this.onPath = false;
                    this.atGoal = true;
                    console.log("end");
                    this.inputVel.x = 0;
                    this.inputVel.y = 0;
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

    protected setTargetPt(pt: {x:number,  y:number}) {
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

    public isUsingTool() {
        return this.usingTool;
    }

    public getToolSlot() {
        return this.usingSlot;
    }

    public getToolHitboxPts() {
        return this.toolHitbox.pts;
    }

    public applyKnockback(pt: { x: number; y: number }, force: number) {
        const hitbox = this.hitboxComponent.getHitbox();
        const centerX = hitbox.x + hitbox.width / 2;
        const centerY = hitbox.y + hitbox.height / 2;

        const deltaX = pt.x - centerX;
        const deltaY = pt.y - centerY;
        const angle = Math.atan2(deltaY, deltaX);

        this.externalForceVel.x -= force * Math.cos(angle);
        this.externalForceVel.y -= force * Math.sin(angle);

    }

    public getType() {
        return this.type;
    }

    public getHealthComponent() {
        return this.healthComponent;
    }
}