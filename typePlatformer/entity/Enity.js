import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
export class Entity {
    constructor(healthComponent, hitboxComponent) {
        this.velocity = { x: 0, y: 0 };
        this.speed = 120;
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }
    update(dt) {
        this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, this.hitboxComponent.getHitbox()), { x: this.hitboxComponent.getHitbox().x + this.velocity.x * dt, y: this.hitboxComponent.getHitbox().y + this.velocity.y * dt }));
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = ("rgb(" + this.hitboxComponent.getColor().red.toString() + "," + this.hitboxComponent.getColor().green.toString() + "," + this.hitboxComponent.getColor().blue.toString() + ")");
        ctx.fillRect(this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
        ctx.closePath();
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    // Convert to plain object for sending via WebSocket
    serialize() {
        return {
            healthComponent: this.healthComponent.serialize(),
            hitboxComponent: this.hitboxComponent.serialize()
        };
    }
    // Create an Entity from received JSON data
    static deserialize(data) {
        return new Entity(HealthComponent.deserialize(data.healthComponent), HitboxComponent.deserialize(data.hitboxComponent));
    }
}
