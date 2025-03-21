export class HitboxComponent {
    constructor(hitbox, color) {
        this.hitbox = hitbox;
        if (color) {
            this.color = color;
        }
    }
    getHitbox() {
        return this.hitbox;
    }
    sethitbox(hitbox) {
        this.hitbox = hitbox;
    }
    getColor() {
        return this.color;
    }
    setColor(color) {
        this.color = color;
    }
}
