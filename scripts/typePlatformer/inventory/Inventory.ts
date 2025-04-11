import { Items } from "../item/Items.js";
import { Slot } from "./Slot.js";

export class Inventory {
    private size: number;
    private inventory: Slot[] = [];
    private selectedSlotIndex: number = 0;

    constructor(size: number) {
        this.size = size;
        for(let i = 0; i < this.size; i++) {
            this.inventory.push(new Slot(Items.EMPTY, 0));
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

    public clear() {
        for(let i = 0; i < this.size; i++) {
            this.inventory[i].removeItem();
        }
    }
}