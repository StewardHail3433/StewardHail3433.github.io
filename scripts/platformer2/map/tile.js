export default class Tile {
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