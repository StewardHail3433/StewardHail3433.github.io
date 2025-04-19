import { Items } from "../item/Items.js";
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
            this.item = Items.EMPTY;
            this.count = 0;
        }
        this.empty = true;
    }
    setItem(item, count) {
        this.item = item;
        this.count = count;
        this.empty = false;
    }
    removeItem() {
        this.item = Items.EMPTY;
        this.count = 0;
        this.empty = true;
    }
    isEmpty() {
        return this.empty;
    }
    addItems(amount) {
        let c = this.count;
        if (this.item.getMaxStackAmount() < c + amount) {
            this.count = this.item.getMaxStackAmount();
            return c + amount - this.item.getMaxStackAmount();
        }
        else {
            this.count = this.count + amount;
            return 0;
        }
    }
    getItem() {
        return this.item;
    }
    getItemCount() {
        return this.count;
    }
    getMaxItemCount() {
        return this.item.getMaxStackAmount();
    }
}
