import Tile from "./tile.js";

export default class Map {
    /** @type {Tile[][]} */ map = [];

    /** @type {CanvasRenderingContext2D} */ ctx;

    #xVel = 0.25;
    constructor(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.ctx = ctx;
        this.tileSize = Math.floor(ctx.canvas.height / 16.44);
        this.yOffset = Math.floor(this.tileSize);
        fetch("./scripts/platformer2/resources/map.txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.map[i] = [];
                    let startingY = -(lines.length * this.tileSize) + ctx.canvas.height - this.tileSize
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.map[i][j] = new Tile(this.ctx);
                        this.map[i][j].value = lines[i].split(" ")[j];
                        this.map[i][j].x = j * this.tileSize;
                        this.map[i][j].y =  (startingY + (i + 1) * this.tileSize);
                        this.map[i][j].width = this.tileSize;
                        this.map[i][j].height = this.tileSize;
                        console.log(this.map[i][j])
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