export default class Tile {
    pos = {
        x:0,
        y:0
    }
    width = 0;
    height = 0;
    #value;
    #ctx;
    #collision = false;
    shouldRender = false;
    constructor(ctx) {
        this.#ctx = ctx;
    }

    
    // Getters

    get width() {
        return this.width;
    }

    get height() {
        return this.height;
    }

    get value() {
        return this.#value;
    }

    get collision() {
        return this.#collision;
    }
    get pos() {
        return this.pos;
    }

    // Setters



    set value(x) {
        this.#value = x;
    }

    set collision(x) {
        this.#collision = x;
    }
}