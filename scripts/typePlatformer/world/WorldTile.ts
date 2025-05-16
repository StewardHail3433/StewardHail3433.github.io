import { ImageLoader } from "../utils/ImageLoader.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";
import { Tile } from "./Tile.js";
import { Tiles } from "./Tiles.js";

export class WorldTile {
    private layers: {tile: Tile}[] = new Array();
    private hitboxComponent: HitboxComponent;

    constructor(
        layers: { tile: Tile}[], 
        hitboxComponent: HitboxComponent = new HitboxComponent({x:0,y:0,width:Constants.TILE_SIZE,height:Constants.TILE_SIZE}, {red:0,green:0,blue:0,alpha:0.0}),
    ) {
        this.layers = layers;
        this.hitboxComponent = hitboxComponent;
    }

    public setLayer(layer: number, tile: Tile) {
        if(tile) {
            this.layers[layer].tile = tile;
        }
    }

    public getLayers(): {tile: Tile}[] {
        return {...this.layers};
    }

    public getHitboxComponent(): HitboxComponent{
        return this.hitboxComponent;
    }

    public render(ctx: CanvasRenderingContext2D, layer: number) {
        if(this.layers[layer] != undefined) {
            if(this.layers[layer].tile != Tiles.EMPTY) {
                this.layers[layer].tile.render(ctx, this.hitboxComponent);
            }
        }
    }    
    
}