import Block from "./block.js";

export default class Player {
    #x;
    #y;
    #xVel = 2;
    #yVel = 0;
    #width;
    #height;
    #color = "blue";
    #alive = "alive";

    #isLeft = false;
    #isRight = false;
    #isAtMiddle = false;
    #moveMapLeft = false;
    #moveMapRight = false;
    /** @type {CanvasRenderingContext2D} */ #ctx;

    constructor(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.#x = ctx.canvas.width/5-ctx.canvas.width*0.01953125;
        this.#y = ctx.canvas.height-ctx.canvas.height/5-ctx.canvas.height*0.01953125;
        this.#width = ctx.canvas.width*0.01953125;
        this.#height = ctx.canvas.width*0.01953125;
        this.#ctx = ctx;

        setInterval(() => {
            this.applyGravity();
        }, 50);

    }

    applyGravity() {
        this.#yVel += 0.1; // Simulate gravity increment
    }

    draw() {
        this.#ctx.beginPath();
        this.#ctx.rect(this.#x, this.#y, this.#width, this.#height);
        this.#ctx.fillStyle = this.#color;
        this.#ctx.fill();
        this.#ctx.lineWidth = 2;
        this.#ctx.strokeStyle = "rgb(0, 0, 0)";
        this.#ctx.stroke();
        this.#ctx.closePath();
    }

    update(/** @type {Block[][]} */  map) {
        this.#y += this.#yVel;
        if (this.#x >= this.#ctx.canvas.width / 2 - this.#width / 2 && this.#x <= this.#ctx.canvas.width / 2 + this.#width / 2) {
            this.#isAtMiddle = true;
            
            if (this.nearLeftEnd(map)) {
                this.#moveMapRight = false;
                if (this.#isLeft) {
                    this.#x -= this.#xVel;
                }
                if (this.#isRight) {
                    this.#moveMapLeft = true;
                } else {
                    this.#moveMapLeft = false;
                }
            } else if (this.nearRightEnd(map)) {
                this.#moveMapLeft = false;
                if (this.#isLeft) {
                    this.#moveMapRight = true;
                } else {
                    this.#moveMapRight = false;
                }
                if (this.#isRight) {
                    this.#x += this.#xVel;
                } 
            } else {
                if (this.#isLeft) {
                    this.#moveMapRight = true;
                } else {
                    this.#moveMapRight = false;
                }
                if (this.#isRight) {
                    this.#moveMapLeft = true;
                } else {
                    this.#moveMapLeft = false;
                }
            }
        } else {
            this.#isAtMiddle = false;
            this.#moveMapLeft = false;
            this.#moveMapRight = false;
            if (this.#isLeft) {
                this.#x -= this.#xVel;
            }
            if (this.#isRight) {
                this.#x += this.#xVel;
            }
        }

        if (this.#y + this.#height >= this.#ctx.canvas.height) { 
            this.#y = this.#ctx.canvas.height - this.#height;
            this.#yVel = 0;
        }

    }

    moveLeft(){
        this.#isLeft = true;
        
    }

    moveRight() {
        this.#isRight = true;
        
    }

    moveLeftStop() {
        this.#isLeft = false;
        
    }

    moveRightStop() {
        this.#isRight = false;
        
    }

    moveJump() {
        if(this.#y + this.#width >= 525){
            this.#yVel = -1;
        }
    }

    get moveMapLeft() {
        return this.#moveMapLeft;
    }

    get moveMapRight() {
        return this.#moveMapRight;
    }

    nearEnd(map) {
        return nearLeftEnd(map) || nearRightEnd(map);
    }

    nearLeftEnd(map) {
        return Math.abs(map[0][0].x - this.#x) <= this.#ctx.canvas.width/2+2;
    }

    nearRightEnd(map) {
        return map[0][map[0].length-1].x - this.#x < this.#ctx.canvas.width
    }
}