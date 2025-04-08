import { HitboxComponent } from "../components/HitboxComponent.js";
import { containBox } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { Tile } from "./Tile.js";
export class WorldHandler {
    constructor() {
        this.worldMap = [];
        this.img = new Image();
        this.generateWorld(1);
        this.img.src = "./resources/typePlatformer/images/tiles/background/grass.png";
    }
    renderBackground(ctx, camera) {
        ctx.drawImage(this.img, camera.getView().x - ((camera.getView().x + camera.getView().width / 2) % Constants.TILE_SIZE * 2), camera.getView().y - ((camera.getView().y + camera.getView().height / 2) % Constants.TILE_SIZE * 2));
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
    renderLayer(layer, ctx, camera) {
        for (let i = 0; i < Constants.WORLD_HEIGHT; i++) {
            for (let j = 0; j < Constants.WORLD_WIDTH; j++) {
                if (containBox(this.worldMap[i][j].getHitboxComponent().getHitbox(), camera.getView())) {
                    this.worldMap[i][j].render(ctx, layer);
                }
            }
        }
    }
    generateWorld(seed) {
        for (let i = 0; i < Constants.WORLD_HEIGHT; i++) {
            let row = [];
            for (let j = 0; j < Constants.WORLD_WIDTH; j++) {
                if (Math.floor(Math.random() * 4) > 0) {
                    row.push(new Tile([{ index: 0 }, { index: 0 }], new HitboxComponent({ x: Constants.TILE_SIZE * i, y: Constants.TILE_SIZE * j, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                }
                else {
                    row.push(new Tile([{ index: Math.floor(Math.random() * 6) }, { index: 0 }], new HitboxComponent({ x: Constants.TILE_SIZE * i, y: Constants.TILE_SIZE * j, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                }
            }
            this.worldMap.push(row);
        }
    }
    getWorldMap() {
        return this.worldMap;
    }
    setWorldMap(worldMap) {
        for (let i = 0; i < worldMap.length; i++) {
            for (let j = 0; j < worldMap[0].length; j++) {
                this.worldMap[i][j] = worldMap[i][j];
            }
        }
    }
    saveWorld() {
    }
}
