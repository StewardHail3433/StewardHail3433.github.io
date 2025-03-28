import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
export class Entity {
    constructor(healthComponent, hitboxComponent) {
        this.velocity = { x: 0, y: 0 };
        this.speed = 120;
        this.direction = "up";
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }
    update(dt) {
        let hitbox = this.hitboxComponent.getHitbox();
        let dist = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (dist > 0) {
            // normalize for dia
            this.velocity.x = Math.abs(this.velocity.x) * (this.velocity.x / dist);
            this.velocity.y = Math.abs(this.velocity.y) * (this.velocity.y / dist);
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, hitbox), { x: hitbox.x + this.velocity.x * dt, y: hitbox.y + this.velocity.y * dt }));
        }
    }
    render(ctx) {
        ctx.fillStyle = ("rgb(" + this.hitboxComponent.getColor().red.toString() + "," + this.hitboxComponent.getColor().green.toString() + "," + this.hitboxComponent.getColor().blue.toString() + ")");
        ctx.fillRect(this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    getDirection() {
        return this.direction;
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
