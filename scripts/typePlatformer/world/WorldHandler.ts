import { Camera } from "../camera/Camera.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Entity } from "../entity/Enity.js";
import { containBox, isInside } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { Tile } from "./Tile.js";

export class WorldHandler {
    // private worldMap: Tile[][] = [];
    private worldMap: Map<string, Tile[][]>;
    private img = new Image();
    private showChunks =false;
    
    constructor() {
        this.worldMap = new Map<string, Tile[][]>();
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
            this.worldMap = new Map<string, Tile[][]>();
        })
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

    public update(camera: Camera) {
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

    private generateChunk(chunkX: number, chunkY: number,seed: number): Tile[][] {
        const chunk: Tile[][] = [];
        for (let i = 0; i < Constants.CHUNK_SIZE; i++) {
            const row: Tile[] = [];
            for (let j = 0; j < Constants.CHUNK_SIZE; j++) {
                let worldX = (chunkX * Constants.CHUNK_SIZE + i) * Constants.TILE_SIZE;
                let worldY = (chunkY * Constants.CHUNK_SIZE + j) * Constants.TILE_SIZE;

                if(Math.floor(Math.random() * 4) > 0) {
                    row.push(new Tile([{index: 0}, {index: 0}], new HitboxComponent({x:worldX, y:worldY, width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0})));
                }
                else {
                    row.push(new Tile([{index: Math.floor(Math.random() * 6)}, {index: 0}], new HitboxComponent({x:worldX, y:worldY, width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0})));
                }
            }
            chunk.push(row);
        }
        this.worldMap.set(chunkX+", "+chunkY, chunk);
        return chunk;
    }

    public getWorldMap(): Map<string, Tile[][]> {
        return this.worldMap;
    }

    private getChunk(chunkX: number, chunkY: number): Tile[][] {
        if (!this.worldMap.has(chunkX+", "+chunkY)) {
            return this.generateChunk(chunkX, chunkY, 1);
        }
        return this.worldMap.get(chunkX+", "+chunkY)!;
    }
    

    public setWorldMap(worldMap: Map<string, Tile[][]>) {
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

        let x = Math.floor((camera.getView().x+camera.getView().width/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));
        let y = Math.floor((camera.getView().y+camera.getView().height/2) / (Constants.TILE_SIZE * Constants.CHUNK_SIZE));

        let cx = x - Constants.RENDER_DISTANCE+1;
        let cy = y - Constants.RENDER_DISTANCE+1;
        for (let i = cx; i < x + Constants.RENDER_DISTANCE; i++) {
            for (let j = cy; j < y + Constants.RENDER_DISTANCE; j++) {
                if (this.worldMap.has(i+", "+j)) {
                    visibleChunks[i+", "+j] = this.worldMap.get(i+", "+j)!.map(row =>
                        row.map(tile => tile.serialize())
                    );
                }
            }
        }
        return visibleChunks;
    }
    

    public loadChunksFromServer(chunks: Map<string, Tile[][]>) {
        chunks.forEach((value, key) => {
            this.worldMap.set(key, value);
        });
    }
    public saveWorld() {
        
    }
}