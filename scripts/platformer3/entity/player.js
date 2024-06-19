import "../utils/collisionChecker.js"
import { collision } from "../utils/collisionChecker.js";
export default class Player  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map) {
        this.width = ctx.canvas.width/102.4;
        this.height = ctx.canvas.height/25.175;
        this.pos = {
            x: ctx.canvas.width/2 - this.width/2,
            y: ctx.canvas.height/2 - this.height/2
        }

        this.vel = {
            x: 0,
            y: 1,
        }

        this.keys = {
            w: false,

            a: false,

            s: false,

            d: false

        }
        this.speed =5;
        this.gravity = 0.5;
        this.jumpMultiplier = 2;
        this.ctx = ctx;
        this.grounded = false;

        this.map = map;
    }

    update(deltaTime) {
        this.move();
        this.collisionOnX();
        this.applyGravity();
        this.collisionOnY();
        //console.log(this.grounded);
    }

    render() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
    move(){
        if (this.keys.a && this.keys.d) {
            this.vel.x = 0
        } else if (this.keys.a) {
            this.vel.x = -this.speed;
        } else if (this.keys.d) {
            this.vel.x = this.speed;
        } else {
            this.vel.x = 0;
        }

        if (this.keys.w && this.grounded && this.vel.y === 0) {
            this.vel.y = -this.speed*this.jumpMultiplier;
            this.grounded = false;
        }

        this.pos.x += this.vel.x;

    }

    keyDownInput(/** @type {KeyboardEvent} */ key) {
        if (key === "a") {
            this.keys.a = true;
        }
        if (key === "d") {
            this.keys.d = true;
        }
        if (key === "w" || key === "ArrowUp" || key === " " && this.grounded == true && this.vel.y == 0) {
            this.keys.w = true;
        }
    }

    keyUpInput(/** @type {KeyboardEvent} */ key) {
        if (key === "a") {
            this.keys.a = false;
        }
        if (key === "d") {
            this.keys.d = false;
        }
        if (key === "w" || key === "ArrowUp" || key === " ") {
            this.keys.w = false;
        }
    }

    collisionOnY() {
        let doBreak = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if(tile.collision) {
                    if (collision(this, tile)) {
                        if (this.vel.y > 0) {
                            this.vel.y = 0;
                            this.pos.y = tile.pos.y - this.height - 0.01;
                            this.grounded = true;
                            doBreak = true;
                            break;
                        }
                        if (this.vel.y < 0) {
                            this.vel.y = 0;
                            this.pos.y = tile.pos.y + tile.height + 0.01;
                            doBreak = true;
                            break;
                        }
                    }
                }
            }
            if(doBreak) {
                //console.log("wda")
                break;
                
            }
        }
        if(this.pos.y + this.height >= this.ctx.canvas.height){
            this.vel.y = 0;
            this.pos.y = this.ctx.canvas.height - this.height;
            this.grounded = true;
        }
    }

    collisionOnX() {
        let doBreak = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if(tile.collision) {
                    if (collision(this, tile)) {
                        if (this.vel.x > 0) {
                            this.vel.x = 0;
                            this.pos.x = tile.pos.x - this.width - 0.01;
                            doBreak = true;
                            break;
                        }
                        if (this.vel.x < 0) {
                            this.vel.x = 0;
                            this.pos.x = tile.pos.x + tile.width + 0.01;
                            doBreak = true;
                            break;
                        }
                    }

                }
            }
            if(doBreak) {
                break;
            }
        }
    }

    applyGravity() {
        this.vel.y += this.gravity
        this.pos.y += this.vel.y;
    }
}