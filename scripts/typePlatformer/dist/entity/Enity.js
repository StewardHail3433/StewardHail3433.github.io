import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
export class Entity {
    constructor(healthComponent, hitbox) {
        this.healthComponent = healthComponent;
        this.hitbox = hitbox;
    }
    update() {
    }
    render(ctx) {
        var _a, _b, _c;
        ctx.beginPath();
        if (this.hitbox.getColor()) {
            ctx.fillStyle = ("rgb(" + ((_a = this.hitbox.getColor()) === null || _a === void 0 ? void 0 : _a.red.toString()) + "," + ((_b = this.hitbox.getColor()) === null || _b === void 0 ? void 0 : _b.green.toString()) + "," + ((_c = this.hitbox.getColor()) === null || _c === void 0 ? void 0 : _c.blue.toString()) + ")");
        }
        else {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.hitbox.getHitbox().x, this.hitbox.getHitbox().y, this.hitbox.getHitbox().width, this.hitbox.getHitbox().height);
        ctx.closePath();
    }
    getHitboxComponent() {
        return this.hitbox;
    }
    // Convert to plain object for sending via WebSocket
    serialize() {
        return {
            health: this.healthComponent.getHealth(),
            x: this.hitbox.getHitbox().x,
            y: this.hitbox.getHitbox().y,
            width: this.hitbox.getHitbox().width,
            height: this.hitbox.getHitbox().height,
            color: this.hitbox.getColor(),
        };
    }
    // Create an Entity from received JSON data
    static deserialize(data) {
        return new Entity(new HealthComponent(data.health, 100), new HitboxComponent({ x: data.x, y: data.y, width: data.width, height: data.height }, data.color));
    }
}
