import { Items } from "../item/Items.js";
import { Slot } from "./Slot.js";
export class Inventory {
    constructor(size, type) {
        this.inventory = [];
        this.selectedSlotIndex = 0;
        this.type = "inventory";
        this.size = size;
        for (let i = 0; i < this.size; i++) {
            this.inventory.push(new Slot(Items.EMPTY, 0));
        }
        if (type) {
            this.type = type;
        }
    }
    getSize() {
        return this.size;
    }
    getType() {
        return this.type;
    }
    setSelecteSlot(index) {
        this.selectedSlotIndex = index;
    }
    getSelecteSlot() {
        return this.inventory[this.selectedSlotIndex];
    }
    getSelecteSlotIndex() {
        return this.selectedSlotIndex;
    }
    getSlot(index) {
        return this.inventory[index];
    }
    clear() {
        for (let i = 0; i < this.size; i++) {
            this.inventory[i].removeItem();
        }
    }
}
