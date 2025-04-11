import { Item } from "./Item.js";

export class Items {
    public static readonly EMPTY:Item = new Item("empty", "empty");
    public static readonly SWORD:Item = new Item("sword", "Sword");
    public static readonly STICK:Item = new Item("stick", "Stick", "This is a stick");

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
}