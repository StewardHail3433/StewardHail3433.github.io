import { UIComponent } from "./UIComponent.js";
export class UIComponentImage extends UIComponent {
    constructor(hitbox, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden, img, sHitbox) {
        super(hitbox, color, hidden);
        this.image = img;
        this.sHitbox = sHitbox;
    }
    render(ctx) {
        var _a, _b, _c, _d;
        if (this.hidden) {
            return;
        }
        super.render(ctx);
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = "high";
        var x = this.hitbox.x;
        var y = this.hitbox.y;
        if (this.parentComponent && !this.parentComponent.isHidden()) {
            x += this.parentComponent.getHitbox().x;
            y += this.parentComponent.getHitbox().y;
        }
        if (this.sHitbox) {
            ctx.drawImage(this.image, (_a = this.sHitbox) === null || _a === void 0 ? void 0 : _a.x, (_b = this.sHitbox) === null || _b === void 0 ? void 0 : _b.y, (_c = this.sHitbox) === null || _c === void 0 ? void 0 : _c.width, (_d = this.sHitbox) === null || _d === void 0 ? void 0 : _d.height, x, y, this.hitbox.width, this.hitbox.height);
        }
        else {
            ctx.drawImage(this.image, x, y, this.hitbox.width, this.hitbox.height);
        }
    }
    setImage(img, sHitbox) {
        this.image = img;
        if (sHitbox) {
            this.sHitbox = sHitbox;
        }
    }
}
