import Entity from "./entity.js";

export default class Player extends Entity {
    
    constructor(x, y, width = 50, height = 50, speed = 0, gravity = 0.5,/** @type {CanvasRenderingContext2D} */ ctx, collision, map) {
        super(x, y, width, height, speed, gravity, ctx, collision, map);
        
    }

    update(deltaTime) {
        if(this.tryJumping && this.grounded) {
            this.vy = -this.speed;
            this.isJumping = true;
            this.grounded = false;
        }
        if(this.tryMovingLeft){
            this.movingLeft = true;
        } else{
            this.movingLeft = false;
        }

        if(this.tryMovingRight){
            this.movingRight = true;
        } else{
            this.movingRight = false;
        }
        console.log(this.grounded)
        super.update(deltaTime);
    }

    render() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    keyDownInput(/** @type {KeyboardEvent} */ key) {
        if(key === "a" || key === "ArrowLeft") {
            this.tryMovingLeft = true;
        }
        if(key === "d" || key === "ArrowRight") {
            this.tryMovingRight = true;
        }
        if(key === "w" || key === "ArrowUp" || key === " ") {
            this.tryJumping = true;
        }
    }

    keyUpInput(/** @type {KeyboardEvent} */ key) {
        if(key === "a" || key === "ArrowLeft") {
            this.tryMovingLeft = false;
        }
        if(key === "d" || key === "ArrowRight") {
            this.tryMovingRight = false;
        }
        if(key === "w" || key === "ArrowUp" || key === " ") {
            this.tryJumping = false;
        }
        if(key === "r") {
            this.x = 50;
            this.y = 50;
        }
    }
}
