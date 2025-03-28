export class Tile {
    private layers: {index: number}[];

    constructor(layers: {index: number}[]) {
        this.layers = layers;
    }

    setLayer(layer: number, indexTile: number) {
        this.layers[layer].index = indexTile
    }

    public getLayers(): {index: number}[] {
        return {...this.layers};
    }
}