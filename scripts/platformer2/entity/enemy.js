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
            if(player.x > this.x){
                this.movingRight = true;
                this.movingLeft =false;
            }
            if(player.x < this.x){
                this.movingRight = false;
                this.movingLeft =true;
            }
            if(player.x + this.width +1 > this.x && player.x - 1 < this.x + this.width) {
                this.movingLeft = false;
                this.movingRight = false;
            }

            if(Math.abs(player.x+player.width/2 - this.x+this.width/2) < 20 && player.y + 10 < this.y) {
                this.tryJumping = true;
            } else {
                this.tryJumping = false;
            }
            //this.movingLeft = false;
            //this.movingLeft = Math.random()*100 > 50;
            this.actionCount = 0;
        } else {
            this.actionCount++;
            if(this.x+this.width >= this.ctx.canvas.width){
                this.movingLeft = true;
            }
        }
        if(this.tryJumping && this.grounded) {
            this.vy = -this.speed;
            this.isJumping = true;
            this.grounded = false;
        }
        
        super.update(deltaTime);
    }

    render() {
        this.ctx.fillStyle = 'purple';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}