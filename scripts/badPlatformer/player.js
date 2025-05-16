import Block from "./block.js";

export default class Player {
    #x;
    #y;
    #xVel = 0.25;
    #yVel = 0;
    #width;
    #height;
    #color = "#0FFF50";
    #alive = "alive";
    #canJump = true;

    #isLeft = false;
    #isRight = false;
    #isAtMiddle = false;
    #moveMapLeft = false;
    #moveMapRight = false;
    /** @type {CanvasRenderingContext2D} */ #ctx;

    constructor(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.#x = 10;
        this.#y = ctx.canvas.height - ctx.canvas.height / 5 - ctx.canvas.height * 0.01953125;
        this.#width = ctx.canvas.width * 0.01953125;
        this.#height = ctx.canvas.width * 0.01953125;
        this.#ctx = ctx;
    }

    applyGravity(deltaTime) {
        this.#yVel += 0.01 * deltaTime * 0.25;
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

    update(/** @type {Block[][]} */  map, deltaTime) {
        this.applyGravity(deltaTime);

        this.#y += this.#yVel * deltaTime;
        if (this.#x >= this.#ctx.canvas.width / 2 - this.#width / 2 && this.#x <= this.#ctx.canvas.width / 2 + this.#width / 2) {
            this.#isAtMiddle = true;

            if (this.nearLeftEnd(map)) {
                this.#moveMapRight = false;
                if (this.#isLeft) {
                    this.#x -= this.#xVel * deltaTime;
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
                    this.#x += this.#xVel * deltaTime;
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
                this.#x -= this.#xVel * deltaTime;
            }
            if (this.#isRight) {
                this.#x += this.#xVel * deltaTime;
            }
        }

        if (this.#y + this.#height >= this.#ctx.canvas.height) {
            this.#y = this.#ctx.canvas.height - this.#height;
            this.#yVel = 0;
        }

        //console.log("x: " + this.#x +", y: " + this.#y +", xVel: " + this.#xVel + ", yVel: " +this.#yVel);

    }

    moveLeft() {
        this.#xVel = 0.25;
        this.#isLeft = true;

    }

    moveRight() {
        this.#xVel = 0.25;
        this.#isRight = true;

    }

    moveLeftStop() {
        this.#isLeft = false;

    }

    moveRightStop() {
        this.#isRight = false;

    }

    moveJump() {
        if (this.#canJump && this.#yVel === 0) {
            this.#yVel = -0.75;
        }
    }

    get isAtMiddle() {
        return this.#isAtMiddle;
    }

    get moveMapLeft() {
        return this.#moveMapLeft;
    }

    get moveMapRight() {
        return this.#moveMapRight;
    }

    set moveMapLeft(x) {
        this.#moveMapLeft = x;
    }

    set moveMapRight(x) {
        this.#moveMapRight = x;
    }

    nearEnd(map) {
        return nearLeftEnd(map) || nearRightEnd(map);
    }

    nearLeftEnd(map) {
        return Math.abs(map[0][0].x - this.#x) <= this.#ctx.canvas.width / 2 + 2;
    }

    nearRightEnd(map) {
        return map[0][map[0].length - 1].x - this.#x < this.#ctx.canvas.width / 2 + 2;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get xVel() {
        return this.#xVel;
    }
    get yVel() {
        return this.#yVel;
    }

    set xVel(x) {
        this.#xVel = x;
    }
    set yVel(x) {
        this.#yVel = x;
    }
    set x(x) {
        this.#x = x
    }

    set y(x) {
        this.#y = x;
    }

    set canJump(x) {
        this.#canJump = x;
    }
}