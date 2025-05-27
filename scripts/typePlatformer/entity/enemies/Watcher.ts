import { Entity } from "../Entity.js";
import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { Constants } from "../../utils/Constants.js";
import { Node } from "../../utils/pathfinding/Node.js";
import { Items } from "../../item/Items.js";
import { drawSpriteSheetSprite } from "../../utils/ImageManipulation.js";
import { ImageLoader } from "../../utils/ImageLoader.js";
import { DropTableHandler } from "../../loottable/dropHandler.js";
import { Tiles } from "../../world/Tiles.js";

export class Watcher extends Entity {
    private lockActionTime:number = 51;
    // private lockActionTime:number = 51;
    private img: HTMLImageElement;
    constructor(healthcomponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthcomponent, hitboxComponent)
        this.speed = (Math.random() * 2 + 1) * 30;
        this.usingSlot.setItem(DropTableHandler.getTileDrop(Tiles.TOOL_LOOT_BOX), 1);
        this.usingTool = true;
        this.img = ImageLoader.getImages()[3];
        this.type = "enemy";
    }

    public update() {
        if (!this.onPath && !this.atGoal) {
            if(this.lockActionTime > 50) {
                const random1 = Math.random() * 100;
                const random2 = Math.random() * 100;
                if (random1 < 33) {
                    this.direction = "up";
                    this.inputVel.y = -this.speed;
                } else if(random1 < 66) {
                    this.direction = "down";
                    this.inputVel.y = this.speed;
                } else {
                    this.inputVel.y = 0;
                }

                if (random2 < 33) {
                    this.direction = "left";
                    this.inputVel.x = -this.speed;
                } else if(random2 < 66) {
                    this.direction = "right";
                    this.inputVel.x = this.speed;
                } else {
                    this.inputVel.x = 0;
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
        super.renderUsingItem(ctx)
        const hitbox = this.hitboxComponent.getHitbox();
        if(this.velocity.x != 0 || this.velocity.y != 0) {
            ctx.imageSmoothingEnabled = false;
            drawSpriteSheetSprite(ctx, this.img, 20/3, this.direction, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE)
        } else {
            if(this.direction === "up") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "down") {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "right") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "left") {
                ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
        }
        // super.render(ctx);
    }
}