export class Tile {
    constructor(layers) {
        this.layers = layers;
    }
    setLayer(layer, indexTile) {
        this.layers[layer].index = indexTile;
    }
    getLayers() {
        return Object.assign({}, this.layers);
    }
}
