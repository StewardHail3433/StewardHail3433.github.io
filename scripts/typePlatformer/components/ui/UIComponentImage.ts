import { UIComponent } from "./UIComponent.js";

export class UIComponentImage extends UIComponent {

    private image: HTMLImageElement;
    private sHitbox?: {x: number; y: number; width: number; height: number};
    constructor(
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        img: HTMLImageElement,
        sHitbox?: {x: number; y: number; width: number; height: number})
    {
        super(hitbox, color, hidden);
        this.image = img;
        this.sHitbox = sHitbox;
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(this.hidden) {
            return;
        }
        super.render(ctx);
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        var x: number = this.hitbox.x; 
        var y: number = this.hitbox.y;
        if(this.parentComponent && !this.parentComponent.isHidden()) {
            x += this.parentComponent.getHitbox().x;
            y += this.parentComponent.getHitbox().y;
        }
        if(this.sHitbox) {
            ctx.drawImage(this.image, this.sHitbox?.x, this.sHitbox?.y, this.sHitbox?.width, this.sHitbox?.height, x, y, this.hitbox.width, this.hitbox.height)
        } else {
            ctx.drawImage(this.image, x, y, this.hitbox.width, this.hitbox.height)

        }
    }


    public setImage(img: HTMLImageElement, sHitbox?: {x: number; y: number; width: number; height: number}) {
        this.image = img;
        if(sHitbox) {
            this.sHitbox = sHitbox;
        }
    }
}