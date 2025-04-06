import { Items } from "../item/items.js";
import { Slot } from "./Slot.js";
export class Inventory {
    constructor(size) {
        this.inventory = [];
        this.selectedSlotIndex = 0;
        this.size = size;
        for (let i = 0; i < size; i++) {
            this.inventory.push(new Slot(Items.empty, 0));
        }
    }
    getSize() {
        return this.size;
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
}
