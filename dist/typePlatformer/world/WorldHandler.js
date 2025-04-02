import { Constants } from "../utils/Constants.js";
import { Tile } from "./Tile.js";
export class WorldHandler {
    constructor() {
        this.worldMap = [];
        this.img = new Image();
        this.generateWorld(1);
        this.img.src = "./resources/typePlatformer/tiles/background/grass.png";
    }
    renderBackground(ctx, camera) {
        ctx.drawImage(this.img, camera.getView().x - (camera.getView().x % Constants.TILE_SIZE) - Constants.TILE_SIZE, camera.getView().y - (camera.getView().y % Constants.TILE_SIZE) - Constants.TILE_SIZE);
    }
    render(ctx) {
        let tilex = 0;
        let tiley = 0;
        for (let i = 0; i < Constants.WORLD_HEIGHT; i++) {
            tiley = Constants.TILE_SIZE * i;
            for (let j = 0; j < Constants.WORLD_WIDTH; j++) {
                tilex = Constants.TILE_SIZE * j;
                ctx.fillStyle = "red";
                if (this.worldMap[i][j].getLayers()[0].index === 1)
                    ctx.fillStyle = "rgba(0,0,0,0.0)";
                else if (this.worldMap[i][j].getLayers()[0].index === 2)
                    ctx.fillStyle = "blue";
                else if (this.worldMap[i][j].getLayers()[0].index === 3)
                    ctx.fillStyle = "rgba(0,0,0,0.0)";
                ctx.fillRect(tilex, tiley, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
        }
    }
    generateWorld(seed) {
        for (let i = 0; i < Constants.WORLD_HEIGHT; i++) {
            let row = [];
            for (let j = 0; j < Constants.WORLD_WIDTH; j++) {
                row.push(new Tile([{ index: Math.floor(Math.random() * 4) }]));
            }
            this.worldMap.push(row);
        }
    }
    saveWorld() {
    }
}
