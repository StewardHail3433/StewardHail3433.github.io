import Block from "./block.js";

export default class Map {
    /** @type {Block[][]} */ #map = [];

    /** @type {CanvasRenderingContext2D} */ #ctx;

    #xVel = 0.25;
    constructor(    /** @type {CanvasRenderingContext2D} */ ctx) {
        this.#ctx = ctx;
        fetch("./scripts/badPlatformer/resources/map.txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.#map[i] = [];
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.#map[i][j] = new Block(this.#ctx);
                        this.#map[i][j].value = lines[i].split(" ")[j];
                        this.#map[i][j].x = j * 32;
                        this.#map[i][j].y = i * 32 + 16;
                        this.#map[i][j].width = 32;
                        this.#map[i][j].height = 32;
                        this.#map[i][j].blockAction();
                    }
                }
            })
            .catch((e) => console.error(e));
    }

    draw() {
        let yOffset = 16;
        for (let i = 0; i < this.#map.length; i++) {
            for (let j = 0; j < this.#map[i].length; j++) {
                this.#map[i][j].blockAction();
                this.#ctx.beginPath();
                this.#ctx.rect(this.#map[i][j].x, this.#map[i][j].y, this.#map[i][j].width, this.#map[i][j].height);

                this.#ctx.fill();
                this.#ctx.closePath();
            }
        }
    }



    update(move, xVel, deltaTime) {
        if (move === "left") {
            this.#xVel = xVel * deltaTime;
        } else if (move === "right") {
            this.#xVel = -xVel * deltaTime;
        } else {
            this.#xVel = 0;
        }

        for (let i = 0; i < this.#map.length; i++) {
            for (let j = 0; j < this.#map[i].length; j++) {
                this.#map[i][j].x = Math.round(this.#map[i][j].x - this.#xVel);
            }
        }
    }

    get  /** @type {Block[][]} */ map() {
        return this.#map
    }
}