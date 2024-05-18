export default class Block {
    #x;
    #y;
    #width;
    #height;
    #value;
    #ctx;
    #collision = false;
    constructor(ctx) {
        this.#ctx = ctx;
    }

    blockAction() {
        if (this.#value === "1") {
            this.#ctx.fillStyle = "blue";
            this.#collision = true;
        } else if (this.#value === "2") {
            this.#ctx.fillStyle = "purple";
            this.#collision = false;
        } else if (this.#value === "3") {
            this.#ctx.fillStyle = "orange";
            this.#collision = false;
        } else if (this.#value === "4") {
            this.#ctx.fillStyle = "MediumSeaGreen";
            this.#collision = false;
        } else {
            this.#ctx.fillStyle = "yellow";
            this.#collision = false;
        }
    }
    // Getters
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

    get value() {
        return this.#value;
    }

    get collision() {
        return this.#collision;
    }

    // Setters
    set x(x) {
        this.#x = x;
    }

    set y(x) {
        this.#y = x;
    }

    set width(x) {
        this.#width = x;
    }

    set height(x) {
        this.#height = x;
    }

    set value(x) {
        this.#value = x;
    }

    set collision(x) {
        this.#collision = x;
    }
}