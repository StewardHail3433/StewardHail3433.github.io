import { HitboxComponent } from "../components/HitboxComponent";
import { Slot } from "./Slot.js";

export class DroppedSlot {

    private hitboxComponent: HitboxComponent;
    private velocity = {x: 0, y: 0};
    private slot: Slot;

    constructor(hitboxComponent: HitboxComponent, slot: Slot, velocity = {x:120, y:120}) {
        this.hitboxComponent = hitboxComponent;
        this.velocity = velocity;
        this.slot = slot;
    }

    public update(dt: number, attactionPt?: {x: number, y: number}) {
        const hitbox = this.hitboxComponent.getHitbox();
        this.hitboxComponent.setHitbox({...hitbox, 
            x: hitbox.x + this.velocity.x * dt,
            y: hitbox.y + this.velocity.y * dt,
        });
        if(attactionPt) {
            const deltaX = attactionPt.x - hitbox.x;
            const deltaY = attactionPt.y - hitbox.y;
            if((deltaX*deltaX) + (deltaY*deltaY) < 50*50) {
                let angle = Math.atan2(deltaY, deltaX);
                this.velocity.x = 30 * Math.cos(angle);
                this.velocity.y = 30 * Math.sin(angle);
            } else {
                this.velocity.x *= 0.90;
                this.velocity.y *= 0.90;
            }
        } else {
            this.velocity.x *= 0.90;
            this.velocity.y *= 0.90;
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(!this.slot.isEmpty()) {
            const img = this.slot.getItem().getImage();
            const hitbox = this.hitboxComponent.getHitbox();
            if(img) {
                ctx.drawImage(img!, hitbox.x, hitbox.y, hitbox.width, hitbox.height);
            } else {
                ctx.fillStyle = "#FF13F0";
                ctx.fillRect(hitbox.x, hitbox.y, hitbox.width/2, hitbox.height/2);
                ctx.fillRect(hitbox.x+hitbox.width/2, hitbox.y +hitbox.height/2, hitbox.width/2, hitbox.height/2);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(hitbox.x, hitbox.y+hitbox.height/2, hitbox.width/2, hitbox.height/2);
                ctx.fillRect(hitbox.x+hitbox.width/2, hitbox.y, hitbox.width/2, hitbox.height/2);
            }
        }
    }

    public getHitboxComponent(): HitboxComponent {
        return this.hitboxComponent;
    }

    public getSlot(): Slot {
        return this.slot;
    }

    public setSlot(slot: Slot) {
        this.slot = slot;
    }
}