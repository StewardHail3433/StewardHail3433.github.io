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

        if (direction == "left") {
            this.vel.x = -this.speed;
        } else if (direction == "right") {
            this.vel.x = this.speed;
        }
        const magnitude = Math.sqrt(this.vel.x ** 2 + (this.slope * this.vel.x) ** 2); // |v| = sqrt(x^2, y^2)
        this.vel.x = (this.vel.x / magnitude) * this.speed;
        this.vel.y = (this.slope * this.vel.x);

    }

    render() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        console.log((Math.sqrt((this.pos.x - this.ogPos.x) ** 2 + (this.pos.y - this.ogPos.y) ** 2)));
    }

    update(deltaTime) {
        // this.pos.x = 1237
        // this.pos.y = 474

        this.pos.x += this.vel.x *deltaTime;

        this.pos.y += this.vel.y * deltaTime;

        if(Math.sqrt((this.pos.x - this.ogPos.x) ** 2 + (this.pos.y - this.ogPos.y) ** 2) > 200) {
            this.delete = true;
        }
    }
}