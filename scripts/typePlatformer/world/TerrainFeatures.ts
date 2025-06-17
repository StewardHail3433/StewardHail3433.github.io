import { Tile } from "./Tile";
import { Tiles } from "./Tiles";

export class TerrainFeature {
    private shape:{tile:Tile, layer:number}[][]
    private anchor:{x: number, y: number}

    constructor(shape:{tile:Tile, layer:number}[][], anchor:{x: number, y: number}) {
        this.shape = shape;
        this.anchor = anchor;
    }
    
    public getShape(): {tile:Tile, layer:number}[][] {
        return this.shape;
    }

    public getAnchor(): {x: number, y: number} {
        return this.anchor;
    }
}

export class TerrainFeatures {
    public static readonly TREE = new TerrainFeature([
        [{tile: Tiles.TREE_LEAVES, layer: 1}],
        [{tile: Tiles.TREE_STUMP, layer: 0}]], {x: 0, y: 1})
    public static readonly BIG_TREE = new TerrainFeature([
        [{tile: Tiles.BIG_TREE_TL, layer: 1}, {tile: Tiles.BIG_TREE_TR, layer: 1}],
        [{tile: Tiles.BIG_TREE_ML, layer: 1}, {tile: Tiles.BIG_TREE_MR, layer: 1}],
        [{tile: Tiles.BIG_TREE_BL, layer: 0}, {tile: Tiles.BIG_TREE_BR, layer: 0}]], {x: 0, y: 2})
    public static readonly GRASS = new TerrainFeature([
        [{tile: Tiles.GRASS, layer: 0}]], {x: 0, y: 0})
}