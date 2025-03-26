import { HitboxComponent } from "../HitboxComponent.js";

export class UIComponent extends HitboxComponent {
    protected hidden: boolean;
    
    constructor(hitbox: {x: number; y: number; width: number; height: number}, color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, hidden: boolean) {
        super(hitbox, color);
        this.hidden = hidden;
    }

    public render(ctx: CanvasRenderingContext2D, element?: UIComponent) {
        if(this.hidden) {
            return;
        }
        if(this.color.alpha) {
            ctx.fillStyle = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue + ", " + this.color.alpha + ")";;
        } else {
            ctx.fillStyle = "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")";;
        }
        var x: number = this.hitbox.x; 
        var y: number = this.hitbox.y;
        if(element && !element.isHidden()) {
            x += element.getHitbox().x;
            y += element.getHitbox().y;
        }
        ctx.fillRect(x, y, this.hitbox.width, this.hitbox.height);
    }

    public hide() {
        this.hidden = true;
    }

    public show() {
        this.hidden = false;
    }

    public isHidden(): boolean {
        return this.hidden
    }

}