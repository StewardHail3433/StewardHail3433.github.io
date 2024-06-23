import { CONSTANTS } from "../../utils/gameConst.js";
import Projectile from "./projectile.js";

export default class CanonballProjectile extends Projectile {
    constructor(ctx, pos, targetPos, index) {
        super(ctx, null, pos, null, index);
        this.width = 5;
        this.height = 5;
        this.targetPos = { 
            x: targetPos.x-this.width/2,
            y: targetPos.y 
        }; 
        this.speed = 0.005 * CONSTANTS.movementScale;
        this.t = 0;
        const midX = (this.pos.x + this.targetPos.x) / 2;
        const midY = (this.pos.y + this.targetPos.y) / 2;
        
        // Determine the control point for the Bezier curve
        this.controlX = midX;
        this.controlY = midY - 100;
    }

    //https://stackoverflow.com/questions/5634460/quadratic-b%C3%A9zier-curve-calculate-points

    render() {
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }


    update(deltaTime) {
        this.t += deltaTime * this.speed;
        // if (this.t > 1) {
        //     this.t = 1;
        // } 

        this.pos.x = (1 - this.t) * (1 - this.t) * this.ogPos.x + 2 * (1 - this.t) * this.t * this.controlX + this.t * this.t * this.targetPos.x;
        this.pos.y = (1 - this.t) * (1 - this.t) * this.ogPos.y + 2 * (1 - this.t) * this.t * this.controlY + this.t * this.t * this.targetPos.y;


        if(Math.sqrt((this.pos.x - this.ogPos.x) ** 2 + (this.pos.y - this.ogPos.y) ** 2) > 300 || this.pos.y >  ((1 - 1) * (1 - 1) * this.ogPos.y + 2 * (1 - 1) * 1 * this.controlY + 1 * 1 * this.targetPos.y) + 60) {
            this.delete = true;
        }
    }
}