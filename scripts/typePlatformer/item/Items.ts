import { Item } from "./Item.js";
import { Tile } from "../world/Tile.js";
import { Entity } from "../entity/Entity.js";
import { ToolItem } from "./tools/ToolItem.js";

export class Items {
    public static readonly EMPTY:Item = new Item("empty", "empty");
    public static readonly SWORD:Item = new Item("sword", "Sword", "This is sharp\nBe careful");
    public static readonly STICK:Item = new Item("stick", "Stick", "This is a stick");
    public static readonly PICKAXE:Item = new ToolItem("pickaxe", "Pickaxe", "Lets Mine", {width: 5, height: 16}, 9);
    public static readonly SWORD_2:Item = new ToolItem("sword2", "Sword 2", "Lets Mine", {width: 6, height: 18}, 9, {step: 2, totalRotationAmount: 180});
    public static readonly SPEED_UP_POTION:Item = new Item("speed_up_potion", "Speed Up Potion", "Speed Me Up", {...this.EMPTY.getSettings(), isConsumable: true}, (entity: Entity) => {
        entity.setSpeed(entity.getSpeed() + 30);
    });
    


    private static readonly items: Record<string, Item> = {}; // YAY I get to try a record

    public static getItemById(id: string): Item {
        if(this.items[id]) {
            return this.items[id];
        }
        return this.EMPTY// this.EMPTY;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
    static {
        for (const key of Object.getOwnPropertyNames(this)) {
            const value = (this as any)[key];
            if (value instanceof Item) {
                this.items[value.getId()] = value;
            }
        }
    }

    public static loadItemsImgs() {
        for(const id in this.items) {
            this.items[id].loadImage();
        }
    }

    public static registerTileItem(tile: Tile): Item {
        this.items[tile.getId()] = new Item(tile.getId(), tile.getName(), "THIS IS A BLOCK", {isBlockItem: true, isConsumable: false});
        return this.items[tile.getId()];
    }
}
