import { Tile } from "./Tile.js";

export class Tiles {
    public static readonly EMPTY:Tile = new Tile("empty", 0);
    public static readonly GRASS:Tile = new Tile("grass", 1, "Grass", {breakTime: 50, solid: false});
    public static readonly ROCK:Tile = new Tile("rock", 2, "Rock", {...this.GRASS.getSettings(), solid: true});
    public static readonly HOLE:Tile = new Tile("hole", 3, "Hole", this.ROCK.getSettings());
    public static readonly TREE:Tile = new Tile("tree", 4, "Small Tree", this.ROCK.getSettings());
    public static readonly DEAD_TREE:Tile = new Tile("deadtree", 5, "Dead Small Tree", this.ROCK.getSettings());
    public static readonly TREE_STUMP:Tile = new Tile("tree_stump", 6, "Tree Stump", this.ROCK.getSettings());
    public static readonly TREE_LEAVES:Tile = new Tile("tree_leaves", 7, "Tree Leave", this.ROCK.getSettings());
    public static readonly WOOD:Tile = new Tile("wood", 8, "Wood", {breakTime: 25, solid: true});
    public static readonly POTION_BOWL:Tile = new Tile("potion_bowl", 9, "Potion Bowl", {breakTime: 5, solid: false});
    public static readonly TOOL_LOOT_BOX:Tile = new Tile("tool_loot_box", 10, "Loot Box(tool)", {breakTime: 25, solid: true});
    public static readonly BIG_TREE_BR:Tile = new Tile("big_tree_br", 11, "Big Tree Part", this.TREE_STUMP.getSettings());
    public static readonly BIG_TREE_MR:Tile = new Tile("big_tree_mr", 12, "Big Tree Part", this.TREE_STUMP.getSettings());
    public static readonly BIG_TREE_TR:Tile = new Tile("big_tree_tr", 13, "Big Tree Part", this.TREE_LEAVES.getSettings());
    public static readonly BIG_TREE_BL:Tile = new Tile("big_tree_bl", 14, "Big Tree Part", this.TREE_LEAVES.getSettings());
    public static readonly BIG_TREE_ML:Tile = new Tile("big_tree_ml", 15, "Big Tree Part", this.TREE_LEAVES.getSettings());
    public static readonly BIG_TREE_TL:Tile = new Tile("big_tree_tl", 16, "Big Tree Part", this.TREE_LEAVES.getSettings());


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

    public static loadTilesImgs() {
        for(const id in this.tiles) {
            this.tiles[id].loadImage();
        }
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