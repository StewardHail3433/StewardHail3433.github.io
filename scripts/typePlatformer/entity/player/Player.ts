import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { Entity } from "../Enity.js";

export class Player extends Entity {
    private name: string;
    private keys: { [key: string]: boolean } = {}
    private controls: any;
    
    constructor(name: string, healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.name = name;
        this.setControls();

        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
    }

    public setControls(controls: {
        up: string,
        down: string,
        left: string,
        right: string,
        jump: string,
        debug: string
    } ={
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        jump: ' ',
        debug: 't',
    }) {
        this.controls = controls;
    }

    public update(dt: number): void {
        this.velocity = {x:0, y:0};
        if (this.keys[this.controls.up]) {
            this.velocity.y = -this.speed;
        } 
        if (this.keys[this.controls.down]) {
            this.velocity.y = this.speed;
        }
        if (this.keys[this.controls.left]) {
            this.velocity.x = -this.speed;
        }
        if (this.keys[this.controls.right]) {
            this.velocity.x = this.speed;
        }
        if(this.keys[this.controls.debug]) {
            this.hitboxComponent.setHitbox({
                ...this.hitboxComponent.getHitbox(), //copy existing values
                x: 200
            });
        }

        super.update(dt);
    }

    public getControls() {
        return this.controls;
    }
    
    public setName(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
    public isMoving(): boolean {
        return this.velocity.x != 0 || this.velocity.y != 0;
    }
}