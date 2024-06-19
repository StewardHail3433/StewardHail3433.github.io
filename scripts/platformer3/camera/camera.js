import { collision } from "../utils/collisionChecker.js";
import { CONSTANTS } from "../utils/gameConst.js";

export default class Camera {
    constructor(/** @type {CanvasRenderingContext2D} */ctx) {
        this.pos = {
            x:0,
            y:0
        }
        /** @type {CanvasRenderingContext2D} */ this.ctx = ctx;
        this.width = this.ctx.canvas.width/CONSTANTS.scale;
        this.height = this.ctx.canvas.height/CONSTANTS.scale;
        
        this.target = null;
    }

    setTarget(x) {
        this.target = x;
    }
    render() {
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    update() {
        if(this.target != null){
            this.pos = {
                x:(this.target.pos.x+this.target.width/2)-this.width/2,
                y:(this.target.pos.y+this.target.height/2)-this.height*2/3
            }
        }
    }

    shouldRender(obj) {
        let shouldRender = false;
        if(collision(this, obj)){
            shouldRender = true;
        }
        return shouldRender;
    }
}