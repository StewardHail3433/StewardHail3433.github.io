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

    public update() {
        let dist = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y); 

        if (dist > 0) {
            // normalize for dia
            this.velocity.x = Math.abs(this.velocity.x) * (this.velocity.x / dist);
            this.velocity.y = Math.abs(this.velocity.y) * (this.velocity.y / dist);
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

    }

    public render(ctx: CanvasRenderingContext2D) {
        const hitbox = this.hitboxComponent.getHitbox();
        const color = this.hitboxComponent.getColor();
        ctx.fillStyle = ("rgb(" + color.red.toString() +","+ color.green.toString() + "," + color.blue.toString() +")");
        ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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

    public getVelocity(): {x: number, y:number} {
        return this.velocity;
    }

    public setVelocity(vel: {x: number, y:number}) {
        this.velocity = vel;
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