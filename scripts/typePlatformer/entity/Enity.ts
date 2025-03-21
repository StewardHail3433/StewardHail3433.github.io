import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";

export class Entity {
    private healthComponent: HealthComponent
    private hitbox: HitboxComponent

    constructor(healthComponent: HealthComponent, hitbox: HitboxComponent) {
        this.healthComponent = healthComponent;
        this.hitbox = hitbox;
    }

    public update() {

    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        if(this.hitbox.getColor()) {
            ctx.fillStyle = ("rgb(" + this.hitbox.getColor()?.red.toString() +","+ this.hitbox.getColor()?.green.toString() + "," + this.hitbox.getColor()?.blue.toString() +")");
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(this.hitbox.getHitbox().x,this.hitbox.getHitbox().y,this.hitbox.getHitbox().width,this.hitbox.getHitbox().height);
        ctx.closePath();
    }

    public getHitboxComponent(): HitboxComponent {
        return this.hitbox;
    }

    // Convert to plain object for sending via WebSocket
    public serialize() {
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
    public static deserialize(data: any): Entity {
        return new Entity(
            new HealthComponent(data.health, 100),
            new HitboxComponent({ x: data.x, y: data.y, width: data.width, height: data.height }, data.color)
        );
    }
}