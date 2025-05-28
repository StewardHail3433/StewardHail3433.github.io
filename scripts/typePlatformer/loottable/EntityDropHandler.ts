import { Watcher } from "../entity/enemies/Watcher";
import { Entity } from "../entity/Entity";
import { Item } from "../item/Item";
import { Items } from "../item/Items";
import { Tiles } from "../world/Tiles";

export class EntityDropTableHandler {
    private static readonly DROPS: Map<typeof Entity, () => Item> = new Map<typeof Entity, () => Item>();

    static {
        this.DROPS.set(Watcher, () => Items.FLESH);
    }

    public static getEntityDrop(entity: Entity): Item {
        let maybeDrop = undefined
        for(const [key, drop] of this.DROPS.entries()) {
            if(entity instanceof key) {
                maybeDrop = drop();
            }
        };
        if(maybeDrop) {
            return maybeDrop
        } return Items.EMPTY
    }
}