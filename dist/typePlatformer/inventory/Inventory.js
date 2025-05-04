import { Slot } from "./Slot.js";
export class Inventory {
    constructor(size, type) {
        this.inventory = [];
        this.selectedSlotIndex = 0;
        this.type = "inventory";
        this.size = size;
        for (let i = 0; i < this.size; i++) {
            this.inventory.push(new Slot());
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
    static transferItems(inv, slot) {
        let amount = 0;
        let emptyIndex = -1;
        if (slot.getItem().getId() != "empty") {
            for (let i = 0; i < inv.getSize(); i++) {
                const invSlot = inv.getSlot(i);
                if (invSlot.isEmpty() && emptyIndex == -1)
                    emptyIndex = i;
                if (invSlot.getItem().getId() == slot.getItem().getId()) {
                    if (amount === 0) {
                        amount = invSlot.addItems(slot.getItemCount());
                        if (amount === 0) {
                            slot.removeItem();
                            break;
                        }
                    }
                    else {
                        amount = invSlot.addItems(amount);
                        if (amount === 0) {
                            slot.removeItem();
                            break;
                        }
                    }
                }
            }
            if (emptyIndex != -1) {
                for (let i = emptyIndex; i < inv.getSize(); i++) {
                    const invSlot = inv.getSlot(i);
                    if (invSlot.isEmpty()) {
                        if (amount === 0) {
                            if (slot.getItemCount() > slot.getItem().getMaxStackAmount()) {
                                invSlot.setItem(slot.getItem(), slot.getItem().getMaxStackAmount());
                                amount = slot.getItemCount() - slot.getItem().getMaxStackAmount();
                            }
                            else {
                                invSlot.setItem(slot.getItem(), slot.getItemCount());
                                amount = 0;
                            }
                            if (amount === 0) {
                                slot.removeItem();
                                break;
                            }
                        }
                        else {
                            if (amount > slot.getItem().getMaxStackAmount()) {
                                invSlot.setItem(slot.getItem(), slot.getItem().getMaxStackAmount());
                                amount = amount - slot.getItem().getMaxStackAmount();
                            }
                            else {
                                invSlot.setItem(slot.getItem(), amount);
                                amount = 0;
                            }
                            if (amount === 0) {
                                slot.removeItem();
                                break;
                            }
                        }
                    }
                }
            }
            else {
                amount = slot.getItemCount();
            }
        }
        if (amount <= 0) {
            slot.removeItem();
        }
        return slot;
    }
}
