import { Items } from "../item/items.js";
export class Slot {
    constructor(item, count) {
        if (item) {
            this.item = item;
            if (count) {
                this.count = count;
            }
            else {
                this.count = 1;
            }
        }
        else {
            this.item = Items.empty;
            this.count = 0;
        }
        this.empty = true;
    }
    setItem(item, count = 1) {
        this.item = item;
        this.count = count;
        this.empty = false;
    }
    removeItem() {
        this.item = Items.empty;
        this.empty = true;
    }
    isEmpty() {
        return this.empty;
    }
    addItems(amount) {
        if (this.item.getMaxStackAmount() < this.count + amount) {
            this.count = this.item.getMaxStackAmount();
            return this.count + amount - this.item.getMaxStackAmount();
        }
        else {
            this.count = this.count + amount;
            return this.count + amount;
        }
    }
    getItem() {
        return this.item;
    }
}
