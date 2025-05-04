import { HitboxComponent } from "../HitboxComponent.js";
export class UIComponent extends HitboxComponent {
    constructor(hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden) {
        super(hitbox, color);
        this.hidden = hidden;
    }
    render(ctx) {
        if (this.hidden) {
            return;
        }
        if (this.color.alpha) {
            ctx.fillStyle = "rgba(" + this.color.red + "," + this.color.green + "," + this.color.blue + ", " + this.color.alpha + ")";
            ;
        }
        else {
            ctx.fillStyle = "rgb(" + this.color.red + "," + this.color.green + "," + this.color.blue + ")";
            ;
        }
        var x = this.hitbox.x;
        var y = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            const parentComponentHitbox = this.parentComponent.getHitbox();
            x += parentComponentHitbox.x;
            y += parentComponentHitbox.y;
        }
        ctx.fillRect(x, y, this.hitbox.width, this.hitbox.height);
    }
    hide() {
        this.hidden = true;
    }
    show() {
        this.hidden = false;
    }
    isHidden() {
        return this.hidden;
    }
    setParentComponent(parentComponent) {
        this.parentComponent = parentComponent;
    }
}
