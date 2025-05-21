import { HitboxComponent } from "../HitboxComponent.js";

export class UIComponent extends HitboxComponent {
    protected hidden: boolean;
    protected parentComponent?: UIComponent;
    protected text = ""; // unused
    
    constructor(hitbox: {x: number; y: number; width: number; height: number}, color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, hidden: boolean) {
        super(hitbox, color);
        this.hidden = hidden;
        return this;
    }

    public render(ctx: CanvasRenderingContext2D) {
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
        if(this.parentComponent && !this.parentComponent.isHidden()) {
            const parentComponentHitbox = this.parentComponent.getHitbox();
            x += parentComponentHitbox.x;
            y += parentComponentHitbox.y;
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

    public update(text: string = this.text) {
        
    }


    public setParentComponent(parentComponent: UIComponent) {
        this.parentComponent = parentComponent;
    }
}