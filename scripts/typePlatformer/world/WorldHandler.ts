import { Camera } from "../camera/Camera.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { DroppedSlot } from "../inventory/DroppedSlot.js";
import { Slot } from "../inventory/Slot.js";
import { Item } from "../item/Item.js";
import { Items } from "../item/Items.js";
import { TileDropTableHandler } from "../loottable/TileDropHandler.js";
import { containBox, isInside } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { TerrainFeature, TerrainFeatures } from "./TerrainFeatures.js";
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import alea from 'alea';
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
    private selectedItem: Item = Items.EMPTY;
    private breakingTile: WorldTile | undefined = undefined;
    private breakTime: number = 0;
    private breakingLayer: number = 0;
    private seed:string = "seed"
    private prng:{
        (): number;
        next(): number;
        uint32(): number;
        fract53(): number;
        version: string;
        args: any[];
        exportState(): [number, number, number, number];
        importState(state: [number, number, number, number]): void;
    }
    private noise2D:NoiseFunction2D
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
            if(args[0]) {
                this.seed = args[0];
                this.prng = alea(this.seed);
                this.noise2D = createNoise2D(this.prng);
            }
        })
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({x: 0, y:0, width: Constants.TILE_SIZE/2, height: Constants.TILE_SIZE/2}), new Slot(Items.PICKAXE, 1)))
    
        this.prng = alea(this.seed);
        this.noise2D = createNoise2D(this.prng);

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

        if(this.selectedItem != Items.EMPTY) {
            if(this.selectedItem.getSettings().isBlockItem) {
                const img = Tiles.getTileById(this.selectedItem.getId()).getImage();
                if(img) {
                    ctx.globalAlpha = 0.25;
                    ctx.drawImage(img!, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE)
                    ctx.globalAlpha = 1.0;
                }
            }
        }

        if(this.breakingTile) {
            if(this.brekaingImg) {
                const tileBreakTime = this.breakingTile.getLayers()[this.breakingLayer].tile.getSettings().breakTime
                if(this.breakTime % tileBreakTime < tileBreakTime / 5) {
                    ctx.drawImage(this.brekaingImg, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % tileBreakTime < tileBreakTime / 5 * 2) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % tileBreakTime < tileBreakTime / 5 * 3) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % tileBreakTime < tileBreakTime / 5 * 4) {
                    ctx.drawImage(this.brekaingImg, Constants.TILE_SIZE * 3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).x  * Constants.TILE_SIZE - 1, Constants.INPUT_HANDLER.getMouseWorldTilePosition(camera).y * Constants.TILE_SIZE - 1, Constants.TILE_SIZE, Constants.TILE_SIZE)
                } else if(this.breakTime % tileBreakTime < tileBreakTime) {
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

    private generateChunk(chunkX: number, chunkY: number, seed: number): WorldTile[][] {
        let chunk: WorldTile[][] = [];
    
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row: WorldTile[] = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;
                row.push(new WorldTile([{tile: Tiles.EMPTY}, {tile: Tiles.EMPTY}, {tile: Tiles.EMPTY}, {tile: Tiles.EMPTY}], new HitboxComponent({x:worldX, y:worldY, width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0})));
            }
            chunk.push(row);
        }

        const treeChance = 0.1; 
        for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
            for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
                const rng = (this.noise2D(x + chunkX*16, y + chunkY*16) + 1) / 2;
                if (rng < treeChance) {
                    this.placeFeature(chunk, TerrainFeatures.TREE, x, y);
                }
            }
        }

        const bigTreeChance = 0.2; 
        for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
            for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
                const rng = (this.noise2D(x + chunkX*16, y + chunkY*16) + 1) / 2;
                if (rng < bigTreeChance && chunk[y][x].getLayers()[TerrainFeatures.BIG_TREE.getShape()[TerrainFeatures.BIG_TREE.getAnchor().y][TerrainFeatures.BIG_TREE.getAnchor().x].layer].tile == Tiles.EMPTY) {
                    this.placeFeature(chunk, TerrainFeatures.BIG_TREE, x, y);
                }
            }
        }

        const grassChance = 0.25; 
        for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
            for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
                const rng = (this.noise2D(x + chunkX*16, y + chunkY*16) + 1) / 2;
                if (rng < grassChance && chunk[y][x].getLayers()[TerrainFeatures.GRASS.getShape()[TerrainFeatures.GRASS.getAnchor().y][TerrainFeatures.GRASS.getAnchor().x].layer].tile == Tiles.EMPTY) {
                    this.placeFeature(chunk, TerrainFeatures.GRASS, x, y);
                }
            }
        }

        this.worldMap.set(chunkX+", "+chunkY, chunk);
        return chunk;
    }

    private placeFeature(chunk: WorldTile[][], feature: TerrainFeature, startX: number, startY: number) {
        const shape = feature.getShape();
        const anchor = feature.getAnchor();

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                const targetX = startX + x - anchor.x;
                const targetY = startY + y - anchor.y;

                if (
                    targetX >= 0 && targetX < Constants.CHUNK_SIZE &&
                    targetY >= 0 && targetY < Constants.CHUNK_SIZE
                ) {
                    let layer = shape[y][x].layer;
                    const tile = shape[y][x].tile;
                    while(chunk[targetY][targetX].getLayers()[layer].tile != Tiles.EMPTY) {
                        layer++;
                    }

                    chunk[targetY][targetX].setLayer(layer, tile);
                }
            }
        }
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

    public dropItem(itemSlot: Slot, position: {x: number, y: number}, vel = {x:120, y:120}) {
        this.droppedItems.push(new DroppedSlot(new HitboxComponent({...position, width:Constants.TILE_SIZE/1.5, height:Constants.TILE_SIZE/1.5}), new Slot(itemSlot.getItem(), itemSlot.getItemCount()), vel))
        
        itemSlot.removeItem();
    }

    public setSelectedItem(item: Item) {
        this.selectedItem = item;
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

    public setBreakingTile(worldTile: WorldTile, layer: number) {
        this.breakingTile = worldTile;
        this.breakingLayer = layer;
        this.breakTime = 0;
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
            const item = TileDropTableHandler.getTileDrop(this.breakingTile.getLayers()[layer].tile)
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