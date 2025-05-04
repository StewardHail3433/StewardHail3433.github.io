import { Tile } from "./Tile.js";

export class Tiles {
    public static readonly EMPTY:Tile = new Tile("empty", 0);
    public static readonly GRASS:Tile = new Tile("grass", 1);
    public static readonly ROCK:Tile = new Tile("rock", 2);
    public static readonly HOLE:Tile = new Tile("hole", 3);
    public static readonly TREE:Tile = new Tile("tree", 4);
    public static readonly DEAD_TREE:Tile = new Tile("deadtree", 5);
    public static readonly TREE_STUMP:Tile = new Tile("tree_stump", 6);
    public static readonly TREE_LEAVES:Tile = new Tile("tree_leaves", 7);
    public static readonly WOOD:Tile = new Tile("wood", 8, "Wood", {breakTime: 25});

    private static readonly tiles: Record<string, Tile> = {}; // YAY I get to try a record

    public static getTileByNumberId(id: number): Tile {
        for (const tileId in this.tiles) {
            if(this.tiles[tileId].getNumberID() == id) {
                return this.tiles[tileId];
            }
        }
        return this.EMPTY// this.EMPTY;
    }

    public static getTileById(id: string): Tile {
        if(this.tiles[id]) {
            return this.tiles[id];
        }
        return this.EMPTY// this.EMPTY;
    }
    

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    static {
        for (const key of Object.getOwnPropertyNames(this)) {
            const value = (this as any)[key];
            if (value instanceof Tile) {
                this.tiles[value.getId()] = value;
            }
        }
    }
}