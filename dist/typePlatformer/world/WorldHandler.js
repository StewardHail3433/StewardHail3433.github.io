import { HitboxComponent } from "../components/HitboxComponent.js";
import { containBox } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { Tile } from "./Tile.js";
export class WorldHandler {
    constructor() {
        this.img = new Image();
        this.showChunks = false;
        this.worldMap = new Map();
        this.img.src = "./resources/typePlatformer/images/tiles/background/grass.png";
        Constants.COMMAND_SYSTEM.addCommand("chunkOutline", (args) => {
            if (args.length === 0) {
                this.showChunks = !this.showChunks;
            }
            else {
                if (args[0] === "show") {
                    this.showChunks = true;
                }
                else if (args[0] === "hide") {
                    this.showChunks = false;
                }
            }
        });
        Constants.COMMAND_SYSTEM.addCommand("worldReset", (args) => {
            this.worldMap = new Map();
        });
    }
    renderBackground(ctx, camera) {
        ctx.drawImage(this.img, camera.getView().x - ((camera.getView().x + camera.getView().width / 2) % (Constants.TILE_SIZE * 2)) - 32, camera.getView().y - ((camera.getView().y + camera.getView().height / 2) % (Constants.TILE_SIZE * 2)) - 32);
    }
    renderLayer(layer, ctx, camera) {
        let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let cx = x - Constants.RENDER_DISTANCE + 1;
        let cy = y - Constants.RENDER_DISTANCE + 1;
        for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                if (this.worldMap.has(i + ", " + j)) {
                    for (let t = 0; t < Constants.CHUNK_SIZE; t++) {
                        for (let f = 0; f < Constants.CHUNK_SIZE; f++) {
                            if (containBox(camera.getView(), this.getChunk(i, j)[t][f].getHitboxComponent().getHitbox())) {
                                this.getChunk(i, j)[t][f].render(ctx, layer);
                            }
                        }
                    }
                    if (this.showChunks) {
                        ctx.strokeRect(this.getChunk(i, j)[0][0].getHitboxComponent().getHitbox().x, this.getChunk(i, j)[0][0].getHitboxComponent().getHitbox().y, Constants.CHUNK_SIZE * Constants.TILE_SIZE, Constants.CHUNK_SIZE * Constants.TILE_SIZE);
                    }
                    ;
                }
            }
        }
    }
    update(camera) {
        let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        console.log(x, y);
        let cx = x - Constants.RENDER_DISTANCE + 1;
        let cy = y - Constants.RENDER_DISTANCE + 1;
        for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                if (!this.worldMap.has(i + ", " + j)) {
                    this.generateChunk(i, j, 1);
                }
            }
        }
    }
    updateServer(camera, socket) {
        if (socket) {
            socket.emit("loadChunk", camera.getView());
        }
    }
    generateChunk(chunkX, chunkY, seed) {
        const chunk = [];
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;
                if (Math.floor(Math.random() * 4) > 0) {
                    row.push(new Tile([{ index: 0 }, { index: 0 }], new HitboxComponent({ x: worldX, y: worldY, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                }
                else {
                    row.push(new Tile([{ index: Math.floor(Math.random() * 6) }, { index: 0 }], new HitboxComponent({ x: worldX, y: worldY, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                }
            }
            chunk.push(row);
        }
        this.worldMap.set(chunkX + ", " + chunkY, chunk);
        console.log(this.worldMap);
        return chunk;
    }
    getWorldMap() {
        return this.worldMap;
    }
    getChunk(chunkX, chunkY) {
        if (!this.worldMap.has(chunkX + ", " + chunkY)) {
            return this.generateChunk(chunkX, chunkY, 1);
        }
        return this.worldMap.get(chunkX + ", " + chunkY);
    }
    setWorldMap(worldMap) {
        this.worldMap = worldMap;
    }
    showChunksOutlines() {
        this.showChunks = true;
    }
    hideChunksOutlines() {
        this.showChunks = false;
    }
    getVisibleChunks(camera) {
        const visibleChunks = new Map();
        let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let cx = x - Constants.RENDER_DISTANCE + 1;
        let cy = y - Constants.RENDER_DISTANCE + 1;
        for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                if (this.worldMap.has(i + ", " + j)) {
                    visibleChunks.set(i + ", " + j, this.worldMap.get(i + ", " + j));
                }
            }
        }
        return visibleChunks;
    }
    loadChunksFromServer(chunks) {
        chunks.forEach((value, key) => {
            this.worldMap.set(key, value);
        });
    }
    saveWorld() {
    }
}
