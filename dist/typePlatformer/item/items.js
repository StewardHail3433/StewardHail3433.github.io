var _a;
import { Item } from "./Item.js";
export class Items {
    static getItemById(id) {
        if (this.items[id]) {
            return this.items[id];
        }
        return this.EMPTY; // this.EMPTY;
    }
}
_a = Items;
Items.EMPTY = new Item("empty", "empty");
Items.SWORD = new Item("sword", "Sword", "This is sharp\nBe careful");
Items.STICK = new Item("stick", "Stick", "This is a stick");
Items.PICKAXE = new Item("pickaxe", "Pickaxe", "Lets Mine");
Items.items = {}; // YAY I get to try a record
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
(() => {
    for (const key of Object.getOwnPropertyNames(_a)) {
        const value = _a[key];
        if (value instanceof Item) {
            _a.items[value.getId()] = value;
        }
    }
})();
