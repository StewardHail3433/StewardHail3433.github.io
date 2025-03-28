import { Constants } from "../utils/Constants.js";
import { Tile } from "./Tile.js";

export class WorldHandler {
    private worldMap: Tile[][] = {};
    
    constructor() {
        this.generateWorld();
    }

    public render(ctx: CanvasRenderingContext2D) {
        let tilex = 0;
        let tiley = 0;
        for(let i = 0; i < Constants.CANVAS_HEIGHT; i++) {
            tiley = Constants.TILE_SIZE * i;
            for(let j = 0; j < Constants.CANVAS_WIDTH; j++) {
                tilex =  Constants.TILE_SIZE * j;
                ctx.fillStyle = "red";
                if(this.worldMap[i][j].getIndex() === 1) ctx.fillStyle = "green";
                if(this.worldMap[i][j].getIndex() === 2) ctx.fillStyle = "blue";
                if(this.worldMap[i][j].getIndex() === 3) ctx.fillStyle = "yellow";
                ctx.fillRect(tilex, tiley, Constants.TILE_SIZE, Constants.TILE_SIZE)
            }
        }
    }

    private generateWorld(seed: number) {
        for(let i = 0; i < Constants.CANVAS_HEIGHT; i++) {
            row = [];
            for(let j = 0; j < Constants.CANVAS_WIDTH; j++) {
                row.push(new Tile(Math.floor(Math.random() * 4)));
            }
            this.worldMap.push(row);
        }
    }

    public saveWorld() {
        
    }
}