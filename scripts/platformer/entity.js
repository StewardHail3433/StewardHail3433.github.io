export default class Entity {
    #x;
    #y;
    #width;
    #height;
    #color = "blue";
    #alive = "alive";
    /** @type {CanvasRenderingContext2D} */ #ctx;


    constructor(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.#x = ctx.canvas.width/2-ctx.canvas.width*0.01953125;
        this.#y = ctx.canvas.height-ctx.canvas.height/5-ctx.canvas.height*0.01953125;
        this.#width = ctx.canvas.width*0.01953125;
        this.#height = ctx.canvas.width*0.01953125;
        this.#ctx = ctx;
    }

    draw() {
        // this.#ctx.beginPath();
        // this.#ctx.rect(this.#x, this.#y, this.#width, this.#height);
        // this.#ctx.fillStyle = this.#color;
        // this.#ctx.fill();
        // this.#ctx.lineWidth = 2;
        // this.#ctx.strokeStyle = "rgb(0, 0, 0)";
        // this.#ctx.stroke();
        // this.#ctx.closePath();
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

    get color() {
        return this.#color;
    }

    get alive() {
        return this.#alive;
    }

    /** @type {CanvasRenderingContext2D} */
    get ctx() {
        return this.#ctx;
    }
}