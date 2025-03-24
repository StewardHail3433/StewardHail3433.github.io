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
        if (color.hex === undefined) {
            this.color = Object.assign({}, color);
        }
        else {
            let hex = color.hex;
            if (hex.length === 3) {
                hex = hex.split("").map(c => c + c).join(""); // Expand shorthand hex
            }
            const red = parseInt(hex.substring(0, 2), 16);
            const green = parseInt(hex.substring(2, 4), 16);
            const blue = parseInt(hex.substring(4, 6), 16);
            this.color = { red: red, green: green, blue: blue };
        }
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
