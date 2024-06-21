import Tile from "./tile.js";

export default class Map {
    /** @type {Tile[][]} */ map = [];

    /** @type {CanvasRenderingContext2D} */ ctx;

    #xVel = 0.25;
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, camera) {
        this.ctx = ctx;
        this.tileSize = Math.floor(ctx.canvas.height / 16.44);
        this.yOffset = Math.floor(this.tileSize);
        this.camera = camera;
        fetch("./resources/plat3/level/level.txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.map[i] = [];
                    let startingY = (lines.length * -this.tileSize) + ctx.canvas.height;
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.map[i][j] = new Tile(this.ctx);
                        this.map[i][j].value = parseInt(lines[i].split(" ")[j]);
                        this.map[i][j].pos.x = j * this.tileSize;
                        this.map[i][j].pos.y =  (startingY + i * this.tileSize);
                        this.map[i][j].width = this.tileSize;
                        this.map[i][j].height = this.tileSize;
                        if(this.map[i][j].value === 1) {
                            this.map[i][j].collision = true;
                        } else{
                            this.map[i][j].collision = false;
                        }
                    }
                }
                this.camera.setMapSize(this.map[0].length* this.tileSize, this.map.length* this.tileSize);
            })
            .catch((e) => console.error(e));
            
    }

    render() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                 /** @type {Tile} */ let tile = this.map[i][j];
                 if(tile.shouldRender) {
                    this.ctx.beginPath();
                    this.ctx.rect(this.map[i][j].pos.x, this.map[i][j].pos.y, this.map[i][j].width, this.map[i][j].height);
                    if(tile.value == 1) {
                        this.ctx.fillStyle = "green";
                    } else if(tile.value == 2) {
                        this.ctx.fillStyle = "brown";
                    } else{
                        this.ctx.fillStyle = "black";
                    }
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }



    update(deltaTime) {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                tile.shouldRender = false;
                if(this.camera.shouldRender(tile)) {
                    tile.shouldRender = true;
                }
            }
        }
    }

    get  /** @type {Tile[][]} */ map() {
        return this.map
    }
}