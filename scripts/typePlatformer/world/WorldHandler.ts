import { Camera } from "../camera/Camera.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Entity } from "../entity/Entity.js";
import { Player } from "../entity/player/Player.js";
import { DroppedSlot } from "../inventory/DroppedSlot.js";
import { Inventory } from "../inventory/Inventory.js";
import { Slot } from "../inventory/Slot.js";
import { Item } from "../item/Item.js";
import { Items } from "../item/Items.js";
import { containBox, isInside } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { Tiles } from "./Tiles.js";
import { WorldTile } from "./WorldTile.js";

export class WorldHandler {
    private worldMap: Map<string, WorldTile[][]>;
    private img = new Image();
    private showChunks = false;
    private droppedItems: DroppedSlot[] = []
    
    constructor() {
        this.worldMap = new Map<string, WorldTile[][]>();
        this.img.src = "./resources/typePlatformer/images/tiles/background/grass.png";

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
        for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                if (this.worldMap.has(i+", "+j)) {
                    for(let t = 0; t < Constants.CHUNK_SIZE; t++) {
                        for(let f = 0; f < Constants.CHUNK_SIZE; f++) {
                            if(containBox(camera.getView(), this.getChunk(i, j)[t][f].getHitboxComponent().getHitbox())) {
                                this.getChunk(i, j)[t][f].render(ctx, layer);
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
        ImageLoader.getImages().forEach(img => {
            if(img.src.substring(img.src.match("resources")?.index!) === "resources/typePlatformer/images/tiles/mouseSelction.png") {
                ctx.drawImage(img, Constants.INPUT_HANDLER.getMouseWorldPosition(camera).x * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldPosition(camera).y * Constants.TILE_SIZE - 1)
            }
        })
    }

    public update(camera: Camera, player: Player, dt: number) {
        let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

        
        let cx = x - Constants.RENDER_DISTANCE+1;
        let cy = y - Constants.RENDER_DISTANCE+1;
        for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
            for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                if (!this.worldMap.has(i+", "+j)) {
                    this.generateChunk(i, j, 1);
                }
            }
        }

        for(let i = 0; i < this.droppedItems.length; i++) {
            let slot = this.droppedItems[i].getSlot();
            if(containBox(player.getHitboxComponent().getHitbox(), this.droppedItems[i].getHitboxComponent().getHitbox())) {
                const playerHotBar = player.getHotbarUI().getInventory();
                const playerInv = player.getInventoryUI().getInventory();

                slot = Inventory.transferItems(playerHotBar, slot);
                    
                if (slot.getItemCount() != 0) {
                    slot = Inventory.transferItems(playerInv, slot);            
                }
                this.droppedItems[i].setSlot(slot);
            }
            if (slot.getItemCount() != 0) {
                this.droppedItems[i].update(dt, {x:player.getHitboxComponent().getHitbox().x +player.getHitboxComponent().getHitbox().width/2, y:player.getHitboxComponent().getHitbox().y + player.getHitboxComponent().getHitbox().height/2})
            }

        }
    }

    public updateServer(camera: Camera, socket: any) {
        if(socket) {
            // cause crasing because spaming load chuns but now only calling when new chuns are found. WOW look at me commenting haha
            let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
            let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

            
            let cx = x - Constants.RENDER_DISTANCE+1;
            let cy = y - Constants.RENDER_DISTANCE+1;
            top:
            for (let i = cx; i < x + ((Constants.RENDER_DISTANCE)); i++) {
                for (let j = cy; j < y + ((Constants.RENDER_DISTANCE)); j++) {
                    if (!this.worldMap.has(i+", "+j)) {
                        socket.emit("loadChunk", camera.getView());
                        break top;
                    }
                }
            }
        }

    }

    private generateChunk(chunkX: number, chunkY: number,seed: number): WorldTile[][] {
        let chunk: WorldTile[][] = [];
        let leavesPos: {x:number, y:number}[] = []
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row: WorldTile[] = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;

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
            chunk.at(leavesPos[i].x)?.at(leavesPos[i].y)?.setLayer(1, 2);
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

    public getVisibleChunks(camera: Camera): Record<string, any> {
        const visibleChunks: Record<string, any> = {};

        // let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        // let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

        // let cx = x - Constants.RENDER_DISTANCE+1;
        // let cy = y - Constants.RENDER_DISTANCE+1;
        // for (let i = cx; i < x + Constants.RENDER_DISTANCE; i++) {
        //     for (let j = cy; j < y + Constants.RENDER_DISTANCE; j++) {
        //         if (this.worldMap.has(i+", "+j)) {
        //             visibleChunks[i+", "+j] = this.worldMap.get(i+", "+j)!.map(row =>
        //                 row.map(tile => tile.serialize())
        //             );
        //         }
        //     }
        // }
        return visibleChunks;
    }
    

    public loadChunksFromServer(chunks: Map<string, WorldTile[][]>) {
        chunks.forEach((value, key) => {
            this.worldMap.set(key, value);
        });
    }

    dropItem(itemSlot: Slot, position: {x: number, y: number}) {
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({...position, width:Constants.TILE_SIZE/1.5, height:Constants.TILE_SIZE/1.5}), new Slot(itemSlot.getItem(), itemSlot.getItemCount())))
        
        itemSlot.removeItem();
    }

    public saveWorld() {
        
    }
}