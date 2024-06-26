import { CONSTANTS } from "../utils/gameConst.js";
import Tile from "./tile.js";

export default class Map {
    /** @type {Tile[][]} */ map = [];

    /** @type {CanvasRenderingContext2D} */ ctx;

    #xVel = 0.25;
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, camera, player) {
        this.ctx = ctx;
        this.tileSize = 31;
        console.log(this.tileSize)
        this.yOffset = Math.floor(this.tileSize);
        this.camera = camera;
        this.player = player
        this.showMini = false;
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
                //this.camera.setTarget(this.map[199][0]);
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
        //this.camera.target.render();
        // this.ctx.scale(1/CONSTANTS.canvasScale, 1/CONSTANTS.canvasScale);
        // this.ctx.translate(this.camera.target.pos.x+this.camera.target.width/2, this.camera.target.pos.y + this.camera.target.height);
        
        
    }

    renderMini() {
        if(this.showMini) {
            this.ctx.scale(1/CONSTANTS.canvasScale, 1/CONSTANTS.canvasScale);
            this.ctx.translate(this.camera.target.pos.x+this.camera.target.width/2, this.camera.target.pos.y + this.camera.target.height);
            for (let i = 0; i < this.map.length; i++) {
                for (let j = 0; j < this.map[i].length; j++) {
                    /** @type {Tile} */ let tile = this.map[i][j];
                    //if(tile.shouldRender) {
                        this.ctx.beginPath();
                        this.ctx.rect(this.map[i][j].pos.x, this.map[i][j].pos.y, this.map[i][j].width, this.map[i][j].height);
                        if(tile.value == 1) {
                            this.ctx.fillStyle = "rgba(0,128,0, 0.2)";
                        } else if(tile.value == 2) {
                            this.ctx.fillStyle = "rgba(165,42,42, 0.2)";
                        } else{
                            this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                        }
                        this.ctx.fill();
                        this.ctx.closePath();
                    //}
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

    keyDownInput(key) {
        if (key === "m") {
            this.showMini = !this.showMini;
        };
    }

    get  /** @type {Tile[][]} */ map() {
        return this.map
    }
}