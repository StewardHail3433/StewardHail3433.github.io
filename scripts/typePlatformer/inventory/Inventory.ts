import { Items } from "../item/items.js";
import { Slot } from "./Slot.js";

export class Inventory {
    private size: number;
    private inventory: Slot[] = [];
    private selectedSlotIndex: number = 0;

    constructor(size: number) {
        this.size = size;
        for(let i = 0; i < size; i++) {
            this.inventory.push(new Slot(Items.empty, 0));
        }
    }

    public getSize(): number {
        return this.size;
    }

    public setSelecteSlot(index: number) {
        this.selectedSlotIndex = index;
    }

    public getSelecteSlot(): Slot {
        return this.inventory[this.selectedSlotIndex];
    }
    public getSelecteSlotIndex(): number {
        return this.selectedSlotIndex;
    }

    public getSlot(index: number): Slot {
        return this.inventory[index];
    }
}