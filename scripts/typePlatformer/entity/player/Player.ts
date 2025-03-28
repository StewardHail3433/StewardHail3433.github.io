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

    private movementButtons = [new UIComponentButton((document.getElementById("gameCanvas") as HTMLCanvasElement), {x:10, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "<-", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        this.keys[this.controls.left] = false;
    }, () => {
        this.keys[this.controls.left] = true;
    }), new UIComponentButton((document.getElementById("gameCanvas") as HTMLCanvasElement), {x:55, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "v", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        this.keys[this.controls.down] = false;
    }, () => {
        this.keys[this.controls.down] = true;
    }), new UIComponentButton((document.getElementById("gameCanvas") as HTMLCanvasElement), {x:100, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "->", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        this.keys[this.controls.right] = false;
    },() => {
        this.keys[this.controls.right] = true;
    }), new UIComponentButton((document.getElementById("gameCanvas") as HTMLCanvasElement), {x:55, y:225, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "^", undefined, 15, {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        this.keys[this.controls.up] = false;
    }, () => {
        this.keys[this.controls.up] = true;
    })]
    
    constructor(name: string, healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.name = name;
        this.setControls();

        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
        this.setToTouch();
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
            this.direction = "up";
            this.velocity.y = -this.speed;
        } 
        if (this.keys[this.controls.down]) {
            this.direction = "down";
            this.velocity.y = this.speed;
        }
        if (this.keys[this.controls.left]) {
            this.direction = "left";
            this.velocity.x = -this.speed;
        }
        if (this.keys[this.controls.right]) {
            this.direction = "right";
            this.velocity.x = this.speed;
        }
        if(this.keys[this.controls.debug]) {
            this.hitboxComponent.setHitbox({
                ...this.hitboxComponent.getHitbox(), //copy existing values
                x: 200
            });
        }

        if(this.touchMode) {
            for(var button of  this.movementButtons) {
                button.show();
            }
        } else {
            for(var button of  this.movementButtons) {
                button.hide();
            }
        }

        super.update(dt);
    }

    public getControls() {
        return {...this.controls};
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
        return this.movementButtons;
    }

    public setToKeyboard() {
        this.touchMode =false;
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
    }
    public setToTouch() {
        document.removeEventListener("keydown", () =>{});
        document.removeEventListener("keyup", () =>{});
        this.touchMode = true;
    }

    public getTouchMode(): boolean {
        return this.touchMode;
    }
}