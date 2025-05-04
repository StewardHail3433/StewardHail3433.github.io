var _a;
import { Items } from "../item/Items.js";
import { Tiles } from "../world/Tiles.js";
export class DropTableHandler {
    static random(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    static getTileDrop(tile) {
        var _b;
        const maybeDrop = (_b = this.DROPS.get(tile)) === null || _b === void 0 ? void 0 : _b();
        if (maybeDrop) {
            return maybeDrop;
        }
        return Items.EMPTY;
    }
}
_a = DropTableHandler;
DropTableHandler.DROPS = new Map();
(() => {
    _a.DROPS.set(Tiles.GRASS, () => Tiles.GRASS.getItem());
    _a.DROPS.set(Tiles.TREE_STUMP, () => Tiles.WOOD.getItem());
    _a.DROPS.set(Tiles.TREE_LEAVES, () => _a.random([Tiles.WOOD.getItem(), Tiles.TREE_LEAVES.getItem()]));
})();
