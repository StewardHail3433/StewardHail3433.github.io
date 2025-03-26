import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { UIComponent } from "../../components/ui/UIComponent.js";
import { UIComponentButton } from "../../components/ui/UIComponentButton.js";
import { Entity } from "../Enity.js";

export class Player extends Entity {
    private name: string;
    private keys: { [key: string]: boolean } = {}
    private controls: any;
    private touchMode =false;
    
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

    public getMovementButton(canvas: HTMLCanvasElement): UIComponent[] {
        return [new UIComponentButton(canvas, {x:10, y:430, width: 40, height: 40}, {red: 255, green:255, blue: 255}, undefined, "<-", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
            this.keys[this.controls.left] = false;
        }, () => {
            this.keys[this.controls.left] = true;
        }), new UIComponentButton(canvas, {x:45, y:430, width: 40, height: 40}, {red: 255, green:255, blue: 255}, undefined, "v", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
            this.keys[this.controls.down] = false;
        }, () => {
            this.keys[this.controls.down] = true;
        }), new UIComponentButton(canvas, {x:90, y:430, width: 40, height: 40}, {red: 255, green:255, blue: 255}, undefined, "->", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
            this.keys[this.controls.right] = false;
        },() => {
            this.keys[this.controls.right] = true;
        }), new UIComponentButton(canvas, {x:45, y:385, width: 40, height: 40}, {red: 255, green:255, blue: 255}, undefined, "^", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
            this.keys[this.controls.up] = false;
        }, () => {
            this.keys[this.controls.up] = true;
        })]
    }

    public setToKeyboard() {
        this.touchMode =false;
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
    }
    public setToTouch() {
        document.removeEventListener("keydown");
        document.removeEventListener("keyup");
        this.touchMode = true;
    }

    public getTouchMode(): boolean {
        return this.touchMode;
    }
}