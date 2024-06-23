import { CONSTANTS } from "../../utils/gameConst.js";

export default class Projectile {
    constructor(ctx, slope, pos, direction,index) {
        this.ctx = ctx;
        this.slope = slope;
        this.pos = {
            x: pos.x,
            y: pos.y
        }

        this.ogPos = {
            x: pos.x,
            y: pos.y
        }
        this.vel = {
            x: 0,
            y: 0,
        }
        this.width = 5;
        this.height = 5;
        this.speed = 1.5 * CONSTANTS.movementScale ;
        this.direction = direction;
        this.delete = false;
        this.index = index;
    }

    render() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        console.log((Math.sqrt((this.pos.x - this.ogPos.x) ** 2 + (this.pos.y - this.ogPos.y) ** 2)));
    }

    update(deltaTime) {
        if (this.direction == "left") {
            this.vel.x = -this.speed;
        } else if (this.direction == "right") {
            this.vel.x = this.speed;
        }
        // this.pos.x = 1237
        // this.pos.y = 474

        this.pos.x += this.vel.x*deltaTime;

        this.pos.y += this.vel.x * this.slope * deltaTime;

        if(Math.sqrt((this.pos.x - this.ogPos.x) ** 2 + (this.pos.y - this.ogPos.y) ** 2) > 200) {
            this.delete = true;
        }
    }
}