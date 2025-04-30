import { Item } from "./Item.js";
import { Tile } from "../world/Tile.js";

export class Items {
    public static readonly EMPTY:Item = new Item("empty", "empty");
    public static readonly SWORD:Item = new Item("sword", "Sword", "This is sharp\nBe careful");
    public static readonly STICK:Item = new Item("stick", "Stick", "This is a stick");
    public static readonly PICKAXE:Item = new Item("pickaxe", "Pickaxe", "Lets Mine");

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

    public static registerTileItem(tile: Tile): Item {
        this.items[tile.getId()] = new Item(tile.getId(), tile.getName(), "THIS IS A BLOCK");
        return this.items[tile.getId()];
    }
}
