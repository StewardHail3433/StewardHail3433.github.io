export class HitboxComponent {
    constructor(hitbox, color = { red: 255, green: 0, blue: 255 }) {
        this.hitbox = hitbox;
        this.color = color;
    }
    getHitbox() {
        return Object.assign({}, this.hitbox);
    }
    setHitbox(hitbox) {
        this.hitbox = Object.assign({}, hitbox);
    }
    getColor() {
        return Object.assign({}, this.color);
    }
    setColor(color) {
        this.color = Object.assign({}, color);
    }
    serialize() {
        return {
            hitbox: Object.assign({}, this.hitbox),
            color: Object.assign({}, this.color),
        };
    }
    // Create an Entity from received JSON data
    static deserialize(data) {
        return new HitboxComponent(data.hitbox, data.color);
    }
}
