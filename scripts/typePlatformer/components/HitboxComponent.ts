export class HitboxComponent {
    private hitbox: {x: number; y: number; width: number; height: number};
    private color?: {red: number; green: number; blue: number}

    public constructor(hitbox: {x: number; y: number; width: number; height: number}, color?: {red: number; green: number; blue: number}) {
        this.hitbox = hitbox
        if(color) {
            this.color = color;
        }
    }

    public getHitbox(): {x: number; y: number; width: number; height: number} {
        return this.hitbox;
    }

    public sethitbox(hitbox: {x: number; y: number; width: number; height: number}) {
        this.hitbox = hitbox;
    }

    public getColor(): {red: number; green: number; blue: number} | undefined {
        return this.color;
    }

    public setColor(color: {red: number; green: number; blue: number} | undefined)  {
        this.color = color;
    }
}