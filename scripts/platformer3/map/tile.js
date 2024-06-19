export default class Tile {
    pos = {
        x:0,
        y:0
    }
    #width;
    #height;
    #value;
    #ctx;
    #collision = false;
    constructor(ctx) {
        this.#ctx = ctx;
    }

    
    // Getters

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