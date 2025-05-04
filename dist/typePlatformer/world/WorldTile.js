import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";
import { Tiles } from "./Tiles.js";
export class WorldTile {
    constructor(layers, hitboxComponent = new HitboxComponent({ x: 0, y: 0, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }, { red: 0, green: 0, blue: 0, alpha: 0.0 })) {
        this.layers = new Array();
        this.layers = layers;
        this.hitboxComponent = hitboxComponent;
    }
    setLayer(layer, tile) {
        if (tile) {
            this.layers[layer].tile = tile;
        }
    }
    getLayers() {
        return Object.assign({}, this.layers);
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    render(ctx, layer) {
        if (this.layers[layer] != undefined) {
            if (this.layers[layer].tile != Tiles.EMPTY) {
                this.layers[layer].tile.render(ctx, this.hitboxComponent);
            }
        }
    }
}
