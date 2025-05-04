var _a;
import { Tile } from "./Tile.js";
export class Tiles {
    static getTileByNumberId(id) {
        for (const tileId in this.tiles) {
            if (this.tiles[tileId].getNumberID() == id) {
                return this.tiles[tileId];
            }
        }
        return this.EMPTY; // this.EMPTY;
    }
}
_a = Tiles;
Tiles.EMPTY = new Tile("empty", 0);
Tiles.GRASS = new Tile("grass", 1);
Tiles.ROCK = new Tile("rock", 2);
Tiles.HOLE = new Tile("hole", 3);
Tiles.TREE = new Tile("tree", 4);
Tiles.DEAD_TREE = new Tile("deadtree", 5);
Tiles.TREE_STUMP = new Tile("tree_stump", 6);
Tiles.TREE_LEAVES = new Tile("tree_leaves", 7);
Tiles.tiles = {}; // YAY I get to try a record
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
(() => {
    for (const key of Object.getOwnPropertyNames(_a)) {
        const value = _a[key];
        if (value instanceof Tile) {
            _a.tiles[value.getId()] = value;
        }
    }
})();
