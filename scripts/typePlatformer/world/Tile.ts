import { ImageLoader } from "../utils/ImageLoader.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";

export class Tile {
    private layers: {index: number}[] = new Array(10);
    private hitboxComponent: HitboxComponent;

    constructor(layers: {index: number}[], hitboxComponent: HitboxComponent = new HitboxComponent({x:0,y:0,width:0,height:0}, {red:0,green:0,blue:0,alpha:0.0})) {
        this.layers = layers;
        this.hitboxComponent = hitboxComponent;
    }

    setLayer(layer: number, indexTile: number) {
        this.layers[layer].index = indexTile
    }

    public getLayers(): {index: number}[] {
        return {...this.layers};
    }
    getHitboxComponent(): HitboxComponent{
        return this.hitboxComponent;
    }

    render(ctx: CanvasRenderingContext2D, layer: number) {
        if(this.layers[layer].index != 0) {
            let spriteSheetMapX = (this.layers[layer].index % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.layers[layer].index / 3) * Constants.TILE_SIZE;
            
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE,   this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
    }
}