import Tile from "./tile.js";

export default class Map {
    /** @type {Tile[][]} */ map = [];

    /** @type {CanvasRenderingContext2D} */ ctx;

    #xVel = 0.25;
    constructor(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.ctx = ctx;
        this.tileSize = this.ctx.canvas.height/16.4375;
        fetch("./scripts/platformer2/resources/map.txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.map[i] = [];
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.map[i][j] = new Tile(this.ctx);
                        this.map[i][j].value = lines[i].split(" ")[j];
                        this.map[i][j].x = j * this.tileSize;
                        this.map[i][j].y = i * this.tileSize + this.tileSize/2;
                        this.map[i][j].width = this.tileSize;
                        this.map[i][j].height = this.tileSize;
                    }
                }
            })
            .catch((e) => console.error(e));
    }

    render() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                 /** @type {Tile} */ let tile = this.map[i][j];
                this.ctx.beginPath();
                this.ctx.rect(this.map[i][j].x, this.map[i][j].y, this.map[i][j].width, this.map[i][j].height);
                if(tile.value === "1") {
                    this.ctx.fillStyle = "green";
                } else{
                    this.ctx.fillStyle = "yellow";
                }
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        
    }



    update(deltaTime) {
        
    }

    get  /** @type {Block[][]} */ map() {
        return this.map
    }
}