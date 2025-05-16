import Entity from "./entity.js";

export default class Player extends Entity {
    
    constructor(x, y, width = 50, height = 50, speed = 0, gravity = 0.5,/** @type {CanvasRenderingContext2D} */ ctx) {
        super(x, y, width, height, speed, gravity, ctx);
        this.tryJumping = false;
    }

    update(deltaTime) {
        if(this.tryJumping && this.grounded) {
            this.vy = -this.speed;
            this.isJumping = true;
            this.grounded = false;
        }
        super.update(deltaTime);
    }

    render() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    keyDownInput(/** @type {KeyboardEvent} */ key) {
        if(key === "a" || key === "ArrowLeft") {
            this.movingLeft = true;
        }
        if(key === "d" || key === "ArrowRight") {
            this.movingRight = true;
        }
        if(key === "w" || key === "ArrowUp" || key === " ") {
            this.tryJumping = true;
        }
    }

    keyUpInput(/** @type {KeyboardEvent} */ key) {
        if(key === "a" || key === "ArrowLeft") {
            this.movingLeft = false;
        }
        if(key === "d" || key === "ArrowRight") {
            this.movingRight = false;
        }
        if(key === "w" || key === "ArrowUp" || key === " ") {
            this.tryJumping = false;
        }
    }
}
