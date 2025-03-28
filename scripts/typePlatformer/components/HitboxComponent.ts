export class HitboxComponent {
    protected hitbox: {x: number; y: number; width: number; height: number};
    protected color: {red: number; green: number; blue: number; alpha?: number}

    public constructor(hitbox: {x: number; y: number; width: number; height: number}, color: {red: number; green: number; blue: number, alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 0.0}) {
        this.hitbox = hitbox;
        this.color = color;
    }

    public getHitbox(): {x: number; y: number; width: number; height: number} {
        return {...this.hitbox};
    }

    public setHitbox(hitbox: {x: number; y: number; width: number; height: number}) {
        this.hitbox = {...hitbox};
    }

    public getColor(): {red: number; green: number; blue: number, alpha?: number} {
        return {...this.color};
    }

    public setColor(color: {red: number; green: number; blue: number, alpha?: number} | {hex: string})  {
        if((color as {hex: string}).hex === undefined) {
            this.color = {...color} as {red: number; green: number; blue: number, alpha: number};
        } else {
            let hex: string = (color as {hex: string}).hex;
            if (hex.length === 3) {
                hex = hex.split("").map(c => c + c).join(""); // Expand shorthand hex
            }
            const red = parseInt(hex.substring(0, 2), 16);
            const green = parseInt(hex.substring(2, 4), 16);
            const blue = parseInt(hex.substring(4, 6), 16);
            const alpha = parseInt(hex.substring(6, 8), 16);
            
            this.color = {red: red, green: green, blue: blue, alpha: alpha};
        }
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