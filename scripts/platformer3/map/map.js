import { CONSTANTS } from "../utils/gameConst.js";
import Tile from "./tile.js";
import TileImageLoader from "./tileImageLoader.js";

export default class Map {
    /** @type {Tile[][]} */ map = [];

    /** @type {CanvasRenderingContext2D} */ ctx;

    #xVel = 0.25;
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, camera, player) {
        this.ctx = ctx;
        this.tileSize = 32;
        console.log(this.tileSize)
        this.yOffset = Math.floor(this.tileSize);
        this.camera = camera;
        this.player = player
        this.showMini = false;
        this.tileImageLoader = new TileImageLoader(this.tileSize);
        const imageSources = {
            grass1Side: "./resources/plat3/tiles/grass/grass1Side.png",
            grassCorner: "./resources/plat3/tiles/grass/grassCorner.png",
            grass3Sides: "./resources/plat3/tiles/grass/grass3Sides.png",
            grass4Sides: "./resources/plat3/tiles/grass/grass4Sides.png",
            grassSurrounded: "./resources/plat3/tiles/grass/grass1Side.png",
            dirt: "./resources/plat3/tiles/dirt.png",
            ladder: "./resources/plat3/tiles/ladder.png",
            water: "./resources/plat3/tiles/water.png"
        };

        // Preload images
        this.tileImageLoader.preloadImages(imageSources)
            .then(() => {
                console.log("All images preloaded");
                this.loadMap(); // Load map after images are ready
            })
            .catch((error) => console.error(error));

        
            
    }

    loadMap() {
        fetch("./resources/plat3/level/level1.txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.map[i] = [];
                    let startingY = (lines.length * -this.tileSize) + this.ctx.canvas.height;
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.map[i][j] = new Tile(this.ctx);
                        this.map[i][j].value = parseInt(lines[i].split(" ")[j]);
                        this.map[i][j].pos.x = j * this.tileSize;
                        this.map[i][j].pos.y =  (startingY + i * this.tileSize);
                        this.map[i][j].width = this.tileSize;
                        this.map[i][j].height = this.tileSize;
                        this.map[i][j].img = new Image(this.tileSize, this.tileSize);
                        
                        this.setTileData(this.map[i][j], i , j, lines);

                        
                    }
                }
                this.camera.setMapSize(this.map[0].length* this.tileSize, this.map.length* this.tileSize);
                //this.camera.setTarget(this.map[199][0]);
                console.log(this.map)
            })
            .catch((e) => console.error(e));
    }

    rotateImage(image, angle) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = this.tileSize;
        canvas.height = this.tileSize;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(image, -this.tileSize / 2, -this.tileSize / 2, this.tileSize, this.tileSize);

        const rotatedImage = new Image(this.tileSize, this.tileSize);
        rotatedImage.src = canvas.toDataURL();
        return rotatedImage;
    }

    setTileData(tile, i , j, lines) {
        if(tile.value === 1) {
            tile.img.src = "./resources/plat3/tiles/grass/grass1Side.png";

            const top = i > 0 ? this.map[i - 1][j].value : 0;
            const bottom = i < lines.length - 1 ? parseInt(lines[i + 1].split(" ")[j]) : 0;
            const left = j > 0 ? this.map[i][j - 1].value : 0;
            const right = j < lines[i].split(" ").length - 1 ? parseInt(lines[i].split(" ")[j + 1]) : 0;

            if (top === 0 && left === 0 && right === 0 && bottom === 0) {
                tile.img.src = "./resources/plat3/tiles/grass/grass4Sides.png";
            } else if (bottom === 0 && left === 0 && right === 0) {
                tile.img = this.tileImageLoader.getImage("grass3Sides");
            } else if (bottom === 0 && left === 0 && top === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass3Sides"), 90);
            } else if (top === 0 && left === 0 && right === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass3Sides"), 180);
            } else if (bottom === 0 && top === 0 && right === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass3Sides"), 270);
            } else if (top === 0 && right === 0) {
                tile.img = this.tileImageLoader.getImage("grassCorner");
            } else if (bottom === 0 && right === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grassCorner"), 90);
            } else if (bottom === 0 && left === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grassCorner"), 180);
            } else if (top === 0 && left === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grassCorner"), 270);
            } else if (top === 0) {
                tile.img.src = "./resources/plat3/tiles/grass/grass1Side.png";
            } else if (left === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass1Side"), 270);      
            } else if (right === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass1Side"), 90);          
            } else if (bottom === 0) {
                tile.img = this.rotateImage(this.tileImageLoader.getImage("grass1Side"), 180);          
            }

            tile.collision = true;
        } else if(tile.value === 2) {
            tile.img.src = "./resources/plat3/tiles/dirt.png";
        } else if(tile.value === 3) {
            tile.img.src = "./resources/plat3/tiles/ladder.png";
            tile.isClimbable = true;
        } else if(tile.value === 4) {
            tile.img.src = "./resources/plat3/tiles/water.png";
            tile.isLiquid = true;
        } else if(tile.value === 5) {
            tile.img.src = "./resources/plat3/tiles/lava.png";
            tile.isLiquid = true;
        } else{
            tile.collision = false;
        }
    }

    setlevel(levelstring) {
        fetch("./resources/plat3/level/" + levelstring + ".txt")
            .then((res) => res.text())
            .then((text) => {
            // do something with "text"
            /** @type {String[]} */ let lines = text.trim().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    this.map[i] = [];
                    let startingY = (lines.length * -this.tileSize) + this.ctx.canvas.height;
                    for (let j = 0; j < lines[i].split(" ").length; j++) {
                        this.map[i][j] = new Tile(this.ctx);
                        this.map[i][j].value = parseInt(lines[i].split(" ")[j]);
                        this.map[i][j].pos.x = j * this.tileSize;
                        this.map[i][j].pos.y =  (startingY + i * this.tileSize);
                        this.map[i][j].width = this.tileSize;
                        this.map[i][j].height = this.tileSize;
                        this.map[i][j].img = new Image(this.tileSize, this.tileSize);
                        
                        this.setTileData(this.map[i][j], i, j, lines);

                        
                    }
                }
                this.camera.setMapSize(this.map[0].length* this.tileSize, this.map.length* this.tileSize);
                //this.camera.setTarget(this.map[199][0]);
                console.log(this.map)
            })
            .catch((e) => console.error(e));
    }

    render() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                 /** @type {Tile} */ let tile = this.map[i][j];
                 if(tile.shouldRender) {
                    this.ctx.beginPath();
                    //this.ctx.rect(this.map[i][j].pos.x, this.map[i][j].pos.y, this.map[i][j].width, this.map[i][j].height);
                    this.ctx.drawImage(tile.img, tile.pos.x, tile.pos.y, this.tileSize, this.tileSize);
                    if(tile.value == 1) {
                        this.ctx.fillStyle = "green";
                    } else if(tile.value == 2) {
                        this.ctx.fillStyle = "brown";
                    } else if(tile.value == 3) {
                        this.ctx.fillStyle = "BurlyWood";
                    } else if(tile.value == 4) {
                        this.ctx.fillStyle = "navy";
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