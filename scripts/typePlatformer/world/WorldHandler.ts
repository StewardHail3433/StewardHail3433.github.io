import { Camera } from "../camera/Camera.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { DroppedSlot } from "../inventory/DroppedSlot.js";
import { Slot } from "../inventory/Slot.js";
import { Item } from "../item/Item.js";
import { Items } from "../item/Items.js";
import { DropTableHandler } from "../loottable/dropHandler.js";
import { containBox, isInside } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { Tile } from "./Tile.js";
import { Tiles } from "./Tiles.js";
import { WorldTile } from "./WorldTile.js";

export class WorldHandler {
    private worldMap: Map<string, WorldTile[][]>;
    private img = new Image();
    private mouseImg = new Image();
    private brekaingImg = new Image();
    private showChunks = false;
    private droppedItems: DroppedSlot[] = [];
    private heldItem: Item = Items.EMPTY;
    private breakingTile: WorldTile | undefined = undefined;
    private breakTime: number = 0;
    
    constructor() {
        this.worldMap = new Map<string, WorldTile[][]>();
        this.img.src = "./resources/typePlatformer/images/tiles/background/grass.png";

        ImageLoader.getImages().forEach(img => {
            if(img.src.substring(img.src.match("resources")?.index!) === "resources/typePlatformer/images/misc/mouseSelction.png") {
                this.mouseImg = img;
            }
        })

        ImageLoader.getImages().forEach(img => {
            if(img.src.substring(img.src.match("resources")?.index!) === "resources/typePlatformer/images/misc/breaking.png") {
                this.brekaingImg = img;
            }
        })

        Constants.COMMAND_SYSTEM.addCommand("chunkOutline", (args: string[]) => {
            if(args.length === 0) {
                this.showChunks = !this.showChunks;
            } else {
                if(args[0] === "show") {
                    this.showChunks = true;
                } else if(args[0] === "hide") {
                    this.showChunks = false;
                }
            }
        })

        Constants.COMMAND_SYSTEM.addCommand("worldReset", (args: string[]) => {
            this.worldMap = new Map<string, WorldTile[][]>();
        })
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({x: 0, y:0, width: Constants.TILE_SIZE/2, height: Constants.TILE_SIZE/2}), new Slot(Items.PICKAXE, 1)))
    }

    public renderBackground(ctx: CanvasRenderingContext2D, camera: Camera) {
        ctx.drawImage(this.img, camera.getView().x - ((camera.getView().x+camera.getView().width/2) % (Constants.TILE_SIZE*2))-32, camera.getView().y - ((camera.getView().y+camera.getView().height/2) % (Constants.TILE_SIZE*2)) -32);
    }

    public renderLayer(layer: number, ctx: CanvasRenderingContext2D, camera: Camera) {
        let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        
        let cx = x - Constants.RENDER_DISTANCE+1;
        let cy = y - Constants.RENDER_DISTANCE+1;
        for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                if (this.worldMap.has(j+", "+i)) {
                    for(let t = 0; t < Constants.CHUNK_SIZE; t++) {
                        for(let f = 0; f < Constants.CHUNK_SIZE; f++) {
                            if(containBox(camera.getView(), this.getChunk(j, i)[t][f].getHitboxComponent().getHitbox())) {
                                this.getChunk(j, i)[t][f].render(ctx, layer);
                            }
                        }
                    }
                    if(this.showChunks) {
                        ctx.strokeRect(this.getChunk(i, j)[0][0].getHitboxComponent().getHitbox().x, this.getChunk(i, j)[0][0].getHitboxComponent().getHitbox().y, Constants.CHUNK_SIZE* Constants.TILE_SIZE, Constants.CHUNK_SIZE* Constants.TILE_SIZE)
                    };
                }
            }
        }
    }

    public renderDropItems(ctx: CanvasRenderingContext2D, camera: Camera) {
        for(let i = 0; i < this.droppedItems.length; i++) {
            if(containBox(camera.getView(), this.droppedItems[i].getHitboxComponent().getHitbox())) {
                this.droppedItems[i].render(ctx);
            }
        }
    }

    public renderMouse(ctx: CanvasRenderingContext2D, camera: Camera) {
        if(this.mouseImg) {
            ctx.drawImage(this.mouseImg, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1)
        }

        if(this.heldItem != Items.EMPTY) {
            const img = this.heldItem.getImage()
            if(img) {
                ctx.globalAlpha = 0.5;
                ctx.drawImage(img!, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE)
                ctx.globalAlpha = 1.0;
            }
        }

        if(this.breakingTile) {
            if(this.brekaingImg) {
                if(this.breakTime % 50 < 10) {
                    ctx.drawImage(this.brekaingImg, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % 50 < 20) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % 50 < 30) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % 50 < 40) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % 50 < 50) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 4, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                }
            }
        }
        
    }

    public update(camera: Camera) {
        let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

        
        let cx = x - Constants.RENDER_DISTANCE+1;
        let cy = y - Constants.RENDER_DISTANCE+1;
        for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                if (!this.worldMap.has(j+", "+i)) {
                    this.generateChunk(j, i, 1);
                }
            }
        }

    }

    public getDroppedItems() {
        return this.droppedItems;
    }

    public updateServer(camera: Camera, socket: any) {
        if(socket) {
            // cause crasing because spaming load chuns but now only calling when new chuns are found. WOW look at me commenting haha
            let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
            let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

            
            let cx = x - Constants.RENDER_DISTANCE+1;
            let cy = y - Constants.RENDER_DISTANCE+1;
            top:
            for (let i = cy; i < y + ((Constants.RENDER_DISTANCE)); i++) {
                for (let j = cx; j < x + ((Constants.RENDER_DISTANCE)); j++) {
                    if (!this.worldMap.has(j+", "+i)) {
                        socket.emit("loadChunk", camera.getView());
                        break top;
                    }
                }
            }
        }

    }

    private generateChunk(chunkX: number, chunkY: number, seed: number): WorldTile[][] {
        let chunk: WorldTile[][] = [];
        let leavesPos: {x:number, y:number}[] = []
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row: WorldTile[] = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;

                if(Math.floor(Math.random() * 4) > 0) {
                    row.push(new WorldTile([{tile: Tiles.EMPTY}, {tile: Tiles.EMPTY}], new HitboxComponent({x:worldX, y:worldY, width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0})));
                }
                else {
                    let treemaybe = Math.floor(Math.random() * 7);
                    row.push(new WorldTile([{tile: Tiles.getTileByNumberId(treemaybe)}, {tile: Tiles.EMPTY}], new HitboxComponent({x:worldX, y:worldY, width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0})));
                    if(treemaybe == 6) {
                        leavesPos.push({x: (worldX/Constants.TILE_SIZE - chunkX * Constants.CHUNK_SIZE), y: (worldY/Constants.TILE_SIZE - chunkY * Constants.CHUNK_SIZE) -1});
                    }
                }
            }
            chunk.push(row);
        }
        for(let i = 0; i < leavesPos.length; i++) {
            chunk.at(leavesPos[i].y)?.at(leavesPos[i].x)?.setLayer(1, Tiles.TREE_LEAVES);
        }
        this.worldMap.set(chunkX+", "+chunkY, chunk);
        return chunk;
    }

    public getWorldMap(): Map<string, WorldTile[][]> {
        return this.worldMap;
    }

    private getChunk(chunkX: number, chunkY: number): WorldTile[][] {
        if (!this.worldMap.has(chunkX+", "+chunkY)) {
            return this.generateChunk(chunkX, chunkY, 1);
        }
        return this.worldMap.get(chunkX+", "+chunkY)!;
    }
    

    public setWorldMap(worldMap: Map<string, WorldTile[][]>) {
        this.worldMap = worldMap;
    }

    public showChunksOutlines() {
        this.showChunks = true;
    }

    public hideChunksOutlines() {
        this.showChunks = false;
    }

    public loadChunksFromServer(chunks: Map<string, WorldTile[][]>) {
        chunks.forEach((value, key) => {
            this.worldMap.set(key, value);
        });
    }

    public dropItem(itemSlot: Slot, position: {x: number, y: number}) {
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({...position, width:Constants.TILE_SIZE/1.5, height:Constants.TILE_SIZE/1.5}), new Slot(itemSlot.getItem(), itemSlot.getItemCount())))
        
        itemSlot.removeItem();
    }

    public setHeldItem(item: Item) {
        this.heldItem = item;
    }

    public getWorldTile(pos: {x: number, y: number}): WorldTile {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description
        const mod = (n: number, d: number): number => {
            return ((n % d) + d) % d
        }
        return this.getChunk(
            Math.floor(pos.x / Constants.CHUNK_SIZE),
            Math.floor(pos.y / Constants.CHUNK_SIZE)
        )[mod(pos.y, Constants.CHUNK_SIZE)][mod(pos.x, Constants.CHUNK_SIZE)];
    }

    public setBreakingTile(worldTile: WorldTile) {
        this.breakingTile = worldTile;
    }

    public updateBreakTime() {
        this.breakTime++;
    }

    public getBreakTime(): number {
        return this.breakTime;
    }

    public clearBreakingTile() {
        this.breakingTile = undefined;
        this.breakTime = 0
    }

    public getBreakingTile(): WorldTile | undefined {
        return this.breakingTile;
    }

    public breakTile(layer: number) {
        if(this.breakingTile) {
            const item = DropTableHandler.getTileDrop(this.breakingTile.getLayers()[layer].tile)
            const breakingTileHitbox = this.breakingTile.getHitboxComponent().getHitbox();
            if(item != Items.EMPTY) {
                this.dropItem(new Slot(item, 1), breakingTileHitbox)
            } else {
                this.dropItem(new Slot(this.breakingTile.getLayers()[layer].tile.getItem(), 1), breakingTileHitbox)
            }
            this.breakingTile?.setLayer(layer, Tiles.EMPTY);
            this.clearBreakingTile()
        }
    }

    public saveWorld() {
        
    }
}