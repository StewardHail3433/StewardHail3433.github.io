import { normalize } from "path";
import { HealthComponent } from "../components/HealthComponent.js";
import { HitboxComponent } from "../components/HitboxComponent.js";

export class Entity {
    protected healthComponent: HealthComponent;
    protected hitboxComponent: HitboxComponent;
    protected velocity = { x: 0, y: 0 };
    protected speed: number = 120;
    protected direction: string = "down";
    protected layer = 0;


    constructor(healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        this.healthComponent = healthComponent;
        this.hitboxComponent = hitboxComponent;
    }

    public update(dt: number) {
        let hitbox = this.hitboxComponent.getHitbox();
        let dist = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y); 

        if (dist > 0) {
            // normalize for dia
            this.velocity.x = Math.abs(this.velocity.x) * (this.velocity.x / dist);
            this.velocity.y = Math.abs(this.velocity.y) * (this.velocity.y / dist);

            this.hitboxComponent.setHitbox({
                ...hitbox,
                x: hitbox.x + this.velocity.x * dt,
                y: hitbox.y + this.velocity.y * dt
            });
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = ("rgb(" + this.hitboxComponent.getColor().red.toString() +","+ this.hitboxComponent.getColor().green.toString() + "," + this.hitboxComponent.getColor().blue.toString() +")");
        ctx.fillRect(this.hitboxComponent.getHitbox().x,this.hitboxComponent.getHitbox().y,this.hitboxComponent.getHitbox().width,this.hitboxComponent.getHitbox().height);
    }

    public getHitboxComponent(): HitboxComponent {
        return this.hitboxComponent;
    }

    public getDirection(): string {
        return this.direction;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public getVelocity() {
        return this.velocity;
    }

    public getLayer(): number {
        return this.layer
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