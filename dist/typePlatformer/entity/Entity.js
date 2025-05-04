import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
export class Entity {
    constructor(healthComponent, hitboxComponent) {
        this.velocity = { x: 0, y: 0 };
        this.speed = 120;
        this.direction = "down";
        this.layer = 0;
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }
    update() {
        let dist = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (dist > 0) {
            // normalize for dia
            this.velocity.x = Math.abs(this.velocity.x) * (this.velocity.x / dist);
            this.velocity.y = Math.abs(this.velocity.y) * (this.velocity.y / dist);
        }
        else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }
    }
    render(ctx) {
        const hitbox = this.hitboxComponent.getHitbox();
        const color = this.hitboxComponent.getColor();
        ctx.fillStyle = ("rgb(" + color.red.toString() + "," + color.green.toString() + "," + color.blue.toString() + ")");
        ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    getDirection() {
        return this.direction;
    }
    getSpeed() {
        return this.speed;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    getVelocity() {
        return this.velocity;
    }
    setVelocity(vel) {
        this.velocity = vel;
    }
    getLayer() {
        return this.layer;
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
