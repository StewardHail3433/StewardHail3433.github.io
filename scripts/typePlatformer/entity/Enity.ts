import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";

export class Entity {
    protected healthComponent: HealthComponent;
    protected hitboxComponent: HitboxComponent;
    protected velocity = { x: 0, y: 0 };
    protected speed: number = 120;


    constructor(healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }

    public update(dt: number) {
        this.hitboxComponent.setHitbox({
            ...this.hitboxComponent.getHitbox(),
            x: this.hitboxComponent.getHitbox().x + this.velocity.x * dt,
            y: this.hitboxComponent.getHitbox().y + this.velocity.y * dt
        });
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = ("rgb(" + this.hitboxComponent.getColor().red.toString() +","+ this.hitboxComponent.getColor().green.toString() + "," + this.hitboxComponent.getColor().blue.toString() +")");
        ctx.fillRect(this.hitboxComponent.getHitbox().x,this.hitboxComponent.getHitbox().y,this.hitboxComponent.getHitbox().width,this.hitboxComponent.getHitbox().height);
    }

    public getHitboxComponent(): HitboxComponent {
        return this.hitboxComponent;
    }

    // Convert to plain object for sending via WebSocket
    public serialize() {
        return {
            healthComponent: this.healthComponent.serialize(),
            hitboxComponent: this.hitboxComponent.serialize()
        };
    }

    // Create an Entity from received JSON data
    public static deserialize(data: any): Entity {
        return new Entity(
            HealthComponent.deserialize(data.healthComponent), 
            HitboxComponent.deserialize(data.hitboxComponent)
        );
    }
}