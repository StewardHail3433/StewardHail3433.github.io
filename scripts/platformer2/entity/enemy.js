import Entity from "./entity.js";

export default class Enemy extends Entity {
    constructor(x, y, width = 50, height = 50, speed = 0, gravity = 0.5,/** @type {CanvasRenderingContext2D} */ ctx) {
        super(x, y, width, height, speed, gravity, ctx);
        this.tryJumping = false;
        this.radius = 10
        this.actionLock =  10
        this.actionCount = 0
    }

    update(deltaTime, player) {
        if(this.actionCount == this.actionLock) {
            this.movingRight = Math.random()*100 > 50;
            this.movingLeft = false;
            //this.movingLeft = Math.random()*100 > 50;
            this.actionCount = 0;
        } else {
            this.actionCount++;
            if(this.x+this.width >= this.ctx.canvas.width){
                this.movingLeft = true;
            }
        }
        
        super.update(deltaTime);
    }

    render() {
        this.ctx.fillStyle = 'purple';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}