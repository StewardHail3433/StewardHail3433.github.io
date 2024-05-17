export default class Player {
    #x;
    #y;
    #xVel = 2;
    #yVel = 0;
    #width;
    #height;
    #color = "blue";
    #alive = "alive";

    #isleft = false;
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
        this.#yVel += 0.05; // Simulate gravity increment
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

    update() {
        this.#y += this.#yVel;

        if(this.#x >= this.#ctx.canvas.width/2-this.#width/2){
            this.#isAtMiddle = true;
            if(this.#isleft == true) {
                this.#x -= this.#xVel;
            } 
            if (this.#isRight) {
                this.#moveMapLeft = true;
            }
        } else {
            if(this.#isleft == true) {
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
        this.#isleft = true;
    }

    moveRight() {
        this.#isRight = true;
    }

    moveLeftStop() {
        this.#isleft = false;
    }

    moveRightStop() {
        this.#isRight = false;
    }

    moveJump() {
        if(this.#y + this.#width >= 525){
            this.#yVel = -1;
        }
    }
}