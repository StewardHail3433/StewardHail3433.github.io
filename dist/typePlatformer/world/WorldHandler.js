import { HitboxComponent } from "../components/HitboxComponent.js";
import { DroppedSlot } from "../inventory/DroppedSlot.js";
import { Slot } from "../inventory/Slot.js";
import { Items } from "../item/Items.js";
import { DropTableHandler } from "../loottable/dropHandler.js";
import { containBox } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { Tiles } from "./Tiles.js";
import { WorldTile } from "./WorldTile.js";
export class WorldHandler {
    constructor() {
        this.img = new Image();
        this.mouseImg = new Image();
        this.brekaingImg = new Image();
        this.showChunks = false;
        this.droppedItems = [];
        this.heldItem = Items.EMPTY;
        this.breakingTile = undefined;
        this.breakTime = 0;
        this.worldMap = new Map();
        this.img.src = "./resources/typePlatformer/images/tiles/background/grass.png";
        ImageLoader.getImages().forEach(img => {
            var _a;
            if (img.src.substring((_a = img.src.match("resources")) === null || _a === void 0 ? void 0 : _a.index) === "resources/typePlatformer/images/misc/mouseSelction.png") {
                this.mouseImg = img;
            }
        });
        ImageLoader.getImages().forEach(img => {
            var _a;
            if (img.src.substring((_a = img.src.match("resources")) === null || _a === void 0 ? void 0 : _a.index) === "resources/typePlatformer/images/misc/breaking.png") {
                this.brekaingImg = img;
            }
        });
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
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({ x: 0, y: 0, width: Constants.TILE_SIZE / 2, height: Constants.TILE_SIZE / 2 }), new Slot(Items.PICKAXE, 1)));
    }
    renderBackground(ctx, camera) {
        ctx.drawImage(this.img, camera.getView().x - ((camera.getView().x + camera.getView().width / 2) % (Constants.TILE_SIZE * 2)) - 32, camera.getView().y - ((camera.getView().y + camera.getView().height / 2) % (Constants.TILE_SIZE * 2)) - 32);
    }
    renderLayer(layer, ctx, camera) {
        let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let cx = x - Constants.RENDER_DISTANCE + 1;
        let cy = y - Constants.RENDER_DISTANCE + 1;
        for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                if (this.worldMap.has(j + ", " + i)) {
                    for (let t = 0; t < Constants.CHUNK_SIZE; t++) {
                        for (let f = 0; f < Constants.CHUNK_SIZE; f++) {
                            if (containBox(camera.getView(), this.getChunk(j, i)[t][f].getHitboxComponent().getHitbox())) {
                                this.getChunk(j, i)[t][f].render(ctx, layer);
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
    renderDropItems(ctx, camera) {
        for (let i = 0; i < this.droppedItems.length; i++) {
            if (containBox(camera.getView(), this.droppedItems[i].getHitboxComponent().getHitbox())) {
                this.droppedItems[i].render(ctx);
            }
        }
    }
    renderMouse(ctx, camera) {
        if (this.mouseImg) {
            ctx.drawImage(this.mouseImg, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1);
        }
        if (this.heldItem != Items.EMPTY) {
            if (this.heldItem.getImage()) {
                ctx.globalAlpha = 0.5;
                ctx.drawImage(this.heldItem.getImage(), Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE);
                ctx.globalAlpha = 1.0;
            }
        }
        if (this.breakingTile) {
            if (this.brekaingImg) {
                if (this.breakTime % 50 < 10) {
                    ctx.drawImage(this.brekaingImg, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE);
                }
                else if (this.breakTime % 50 < 20) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE);
                }
                else if (this.breakTime % 50 < 30) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE);
                }
                else if (this.breakTime % 50 < 40) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE);
                }
                else if (this.breakTime % 50 < 50) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 4, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE);
                }
            }
        }
    }
    update(camera) {
        let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let cx = x - Constants.RENDER_DISTANCE + 1;
        let cy = y - Constants.RENDER_DISTANCE + 1;
        for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                if (!this.worldMap.has(j + ", " + i)) {
                    this.generateChunk(j, i, 1);
                }
            }
        }
    }
    getDroppedItems() {
        return this.droppedItems;
    }
    updateServer(camera, socket) {
        if (socket) {
            // cause crasing because spaming load chuns but now only calling when new chuns are found. WOW look at me commenting haha
            let x = Math.floor((camera.getView().x + camera.getView().width / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
            let y = Math.floor((camera.getView().y + camera.getView().height / 2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
            let cx = x - Constants.RENDER_DISTANCE + 1;
            let cy = y - Constants.RENDER_DISTANCE + 1;
            top: for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
                for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                    if (!this.worldMap.has(j + ", " + i)) {
                        socket.emit("loadChunk", camera.getView());
                        break top;
                    }
                }
            }
        }
    }
    generateChunk(chunkX, chunkY, seed) {
        var _a, _b;
        let chunk = [];
        let leavesPos = [];
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;
                if (Math.floor(Math.random() * 4) > 0) {
                    row.push(new WorldTile([{ tile: Tiles.EMPTY }, { tile: Tiles.EMPTY }], new HitboxComponent({ x: worldX, y: worldY, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                }
                else {
                    let treemaybe = Math.floor(Math.random() * 7);
                    row.push(new WorldTile([{ tile: Tiles.getTileByNumberId(treemaybe) }, { tile: Tiles.EMPTY }], new HitboxComponent({ x: worldX, y: worldY, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })));
                    if (treemaybe == 6) {
                        leavesPos.push({ x: (worldX / Constants.TILE_SIZE - chunkX * Constants.CHUNK_SIZE), y: (worldY / Constants.TILE_SIZE - chunkY * Constants.CHUNK_SIZE) - 1 });
                    }
                }
            }
            chunk.push(row);
        }
        for (let i = 0; i < leavesPos.length; i++) {
            (_b = (_a = chunk.at(leavesPos[i].y)) === null || _a === void 0 ? void 0 : _a.at(leavesPos[i].x)) === null || _b === void 0 ? void 0 : _b.setLayer(1, Tiles.TREE_LEAVES);
        }
        this.worldMap.set(chunkX + ", " + chunkY, chunk);
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
    loadChunksFromServer(chunks) {
        chunks.forEach((value, key) => {
            this.worldMap.set(key, value);
        });
    }
    dropItem(itemSlot, position) {
        this.droppedItems.push(new DroppedSlot(new HitboxComponent(Object.assign(Object.assign({}, position), { width: Constants.TILE_SIZE / 1.5, height: Constants.TILE_SIZE / 1.5 })), new Slot(itemSlot.getItem(), itemSlot.getItemCount())));
        itemSlot.removeItem();
    }
    setHeldItem(item) {
        this.heldItem = item;
    }
    getWorldTile(pos) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description
        const mod = (n, d) => {
            return ((n % d) + d) % d;
        };
        return this.getChunk(Math.floor(pos.x / Constants.CHUNK_SIZE), Math.floor(pos.y / Constants.CHUNK_SIZE))[mod(pos.y, Constants.CHUNK_SIZE)][mod(pos.x, Constants.CHUNK_SIZE)];
    }
    setBreakingTile(worldTile) {
        this.breakingTile = worldTile;
    }
    updateBreakTime() {
        this.breakTime++;
    }
    getBreakTime() {
        return this.breakTime;
    }
    clearBreakingTile() {
        this.breakingTile = undefined;
        this.breakTime = 0;
    }
    getBreakingTile() {
        return this.breakingTile;
    }
    breakTile(layer) {
        var _a;
        if (this.breakingTile) {
            const item = DropTableHandler.getTileDrop(this.breakingTile.getLayers()[layer].tile);
            if (item != Items.EMPTY) {
                this.dropItem(new Slot(item, 1), this.breakingTile.getHitboxComponent().getHitbox());
            }
            else {
                this.dropItem(new Slot(this.breakingTile.getLayers()[layer].tile.getItem(), 1), this.breakingTile.getHitboxComponent().getHitbox());
            }
            (_a = this.breakingTile) === null || _a === void 0 ? void 0 : _a.setLayer(layer, Tiles.EMPTY);
            this.clearBreakingTile();
        }
    }
    saveWorld() {
    }
}
