import { Item } from "../Item";

export class ToolItem extends Item {
    private hitbox: {width: number, height: number};
    private damage = 1;
    private swingAngle = {step: 5, totalRotationAmount: 180}

    constructor(id: string, name: string, discription:string = "This is an Tool item(I think)", hitbox = {width: 12, height: 16}, damage: number = 9, swingAngleSettings = {step: 5, totalRotationAmount: 180}) {
        super(id, name, discription)
        this.hitbox = hitbox;
        this.damage = damage;
        this.swingAngle = swingAngleSettings;
    }

    public getHitbox(): {width: number, height: number} {
        return this.hitbox;
    }

    public getDamage() {
        return this.damage;
    }

    public getSwingAngleSettings(): {step: number, totalRotationAmount: number} {
        return this.swingAngle;
    }
}