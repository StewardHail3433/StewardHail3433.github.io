export class HitboxComponent {
    private hitbox: {x: number; y: number; width: number; height: number};
    private color: {red: number; green: number; blue: number}

    public constructor(hitbox: {x: number; y: number; width: number; height: number}, color: {red: number; green: number; blue: number} = { red: 255, green: 0, blue: 255 }) {
        this.hitbox = hitbox
        this.color = color;
    }

    public getHitbox(): {x: number; y: number; width: number; height: number} {
        return {...this.hitbox};
    }

    public setHitbox(hitbox: {x: number; y: number; width: number; height: number}) {
        this.hitbox = {...hitbox};
    }

    public getColor(): {red: number; green: number; blue: number} {
        return {...this.color};
    }

    public setColor(color: {red: number; green: number; blue: number})  {
        this.color = {...color};
    }

    public serialize() {
        return {
            hitbox: {...this.hitbox},
            color: {...this.color},
        };
    }

    // Create an Entity from received JSON data
    public static deserialize(data: any): HitboxComponent {
        return new HitboxComponent(data.hitbox, data.color);
    }
}