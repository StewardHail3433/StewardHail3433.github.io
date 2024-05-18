export default class Block {
    #x;
    #y;
    #width;
    #height;
    #value;
    #ctx;
    constructor(ctx) {
        this.#ctx = ctx;
    }

    blockAction() {
        if (this.#value === "1") {
            this.#ctx.fillStyle = "blue";
        } else if (this.#value === "2") {
            this.#ctx.fillStyle = "purple";
        } else if (this.#value === "3") {
            this.#ctx.fillStyle = "orange";
        } else if (this.#value === "4") {
            this.#ctx.fillStyle = "MediumSeaGreen";
        } else {
            this.#ctx.fillStyle = "yellow";
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

    // Setters
    set x(value) {
        this.#x = value;
    }

    set y(value) {
        this.#y = value;
    }

    set width(value) {
        this.#width = value;
    }

    set height(value) {
        this.#height = value;
    }

    set value(value) {
        this.#value = value;
    }
}