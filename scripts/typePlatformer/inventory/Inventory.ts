import { Items } from "../item/Items.js";
import { Slot } from "./Slot.js";

export class Inventory {
    private size: number;
    private inventory: Slot[] = [];
    private selectedSlotIndex: number = 0;
    private type = "inventory";

    constructor(size: number, type?: string) {
        this.size = size;
        for(let i = 0; i < this.size; i++) {
            this.inventory.push(new Slot());
        }

        if(type) {
            this.type = type;
        }
    }

    public getSize(): number {
        return this.size;
    }

    public getType(): string {
        return this.type;
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

    public static transferItems(inv: Inventory, slot: Slot): Slot {
        let amount = 0;
        let emptyIndex = -1;
        if(slot.getItem().getId() != "empty") {
            for(let i = 0; i < inv.getSize(); i++) {
                if(inv.getSlot(i).isEmpty() && emptyIndex == -1) emptyIndex = i;
                if(inv.getSlot(i).getItem().getId() == slot.getItem().getId()) {
                    if(amount === 0) {
                        amount = inv.getSlot(i).addItems(slot.getItemCount());
                        if(amount === 0) {
                            slot.removeItem()
                            break;
                        }
                    } else {
                        amount = inv.getSlot(i).addItems(amount);
                        if(amount === 0) {
                            slot.removeItem()
                            break;
                        }
                    }
                }
            }

            if(emptyIndex != -1) {
                for(let i = emptyIndex; i < inv.getSize(); i++) {
                    if(inv.getSlot(i).isEmpty()) {
                        if(amount === 0) {
                                if(slot.getItemCount() > slot.getItem().getMaxStackAmount()) {
                                    inv.getSlot(i).setItem(slot.getItem(), slot.getItem().getMaxStackAmount());
                                    amount = slot.getItemCount() - slot.getItem().getMaxStackAmount();
                                } else {
                                    inv.getSlot(i).setItem(slot.getItem(), slot.getItemCount());
                                    amount = 0;
                                }
                            if(amount === 0) {
                                slot.removeItem();
                                break;
                            }
                        } else {
                            if(amount > slot.getItem().getMaxStackAmount()) {
                                inv.getSlot(i).setItem(slot.getItem(), slot.getItem().getMaxStackAmount());
                                amount = amount - slot.getItem().getMaxStackAmount();
                            } else {
                                inv.getSlot(i).setItem(slot.getItem(), amount);
                                amount = 0;
                            }
                            if(amount === 0) {
                                slot.removeItem();
                                break;
                            }
                        }
                    }
                }
            }
        }
        if(amount <= 0) {
            slot.removeItem();
        }
        return slot;
    }
}