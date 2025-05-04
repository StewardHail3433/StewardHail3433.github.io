import { Item } from "../item/Item.js"
import { Items } from "../item/Items.js";
import { Tile } from "../world/Tile.js"
import { Tiles } from "../world/Tiles.js"

export class DropTableHandler {
    private static readonly DROPS: Map<Tile, () =>Item> = new Map<Tile, () => Item>();

    static {
        this.DROPS.set(Tiles.GRASS, () => Tiles.GRASS.getItem());
        this.DROPS.set(Tiles.TREE_STUMP, () => Tiles.WOOD.getItem());
        this.DROPS.set(Tiles.TREE_LEAVES, () => DropTableHandler.random([Tiles.WOOD.getItem(), Tiles.TREE_LEAVES.getItem()]));
    }

    private static random(items: Item[]) {
        return items[Math.floor(Math.random() * items.length)];
    }

    public static getTileDrop(tile: Tile): Item {
        const maybeDrop = this.DROPS.get(tile)?.();
        if(maybeDrop) {
            return maybeDrop
        } return Items.EMPTY
    }
}