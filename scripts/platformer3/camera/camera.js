import { collision } from "../utils/collisionChecker.js";
import { CONSTANTS } from "../utils/gameConst.js";

export default class Camera {
    constructor(/** @type {CanvasRenderingContext2D} */ctx) {
        this.pos = {
            x:0,
            y:0
        }
        /** @type {CanvasRenderingContext2D} */ this.ctx = ctx;
        this.width = this.ctx.canvas.width/CONSTANTS.canvasScale;
        this.height = this.ctx.canvas.height/CONSTANTS.canvasScale;
        
        this.target = null;

        this.mapWidth;
        this.mapWidth;
        this.leftBoundary = false;
        this.rightBoundary = false;
        this.topBoundary = false;
        this.bottomBoundary = false;
    }

    setMapSize(width, height) {
        this.mapWidth = width;
        this.mapHeight = height;
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
        this.checkBoundaries()
    }

    checkBoundaries() {
        if(this.pos.x + this.width >= this.mapWidth) {
            this.pos.x = this.mapWidth - this.width - 0.01;
            this.rightBoundary = true;
        } else {
            this.rightBoundary = false;
        }
        if(this.pos.x <= 0) {
            this.pos.x = 0.01;
            this.leftBoundary = true;
        } else {
            this.leftBoundary = false;
        }
        if(this.pos.y + this.height >= this.ctx.canvas.height) {
            this.pos.y = this.ctx.canvas.height - this.height - 0.01;
            this.bottomBoundary = true;
        } else {
            this.bottomBoundary = false;
        }
        if(this.pos.y <= this.ctx.canvas.height - this.mapHeight) {
            this.pos.y = this.ctx.canvas.height - this.mapHeight + 0.01;
            this.topBoundary = true;
        } else {
            this.topBoundary = false;
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