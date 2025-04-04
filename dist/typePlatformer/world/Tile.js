import { ImageLoader } from "../utils/ImageLoader.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";
export class Tile {
    constructor(layers, hitboxComponent = new HitboxComponent({ x: 0, y: 0, width: 0, height: 0 }, { red: 0, green: 0, blue: 0, alpha: 0.0 })) {
        this.layers = new Array(10);
        this.layers = layers;
        this.hitboxComponent = hitboxComponent;
    }
    setLayer(layer, indexTile) {
        this.layers[layer].index = indexTile;
    }
    getLayers() {
        return Object.assign({}, this.layers);
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    render(ctx, layer) {
        if (this.layers[layer].index != 0) {
            let spriteSheetMapX = (this.layers[layer].index % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.layers[layer].index / 3) * Constants.TILE_SIZE;
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
    }
}
