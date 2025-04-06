import { Item } from "../item/Item.js";
import { Items } from "../item/items.js";

export class Slot {
    private item: Item;
    private count: number;
    private empty: boolean;

    constructor(item?: Item, count?: number) {

        if (item) {
            this.item = item;
            if(count) {
                this.count = count;
            } else {
                this.count = 1;
            }
        } else {
            this.item = Items.empty;
            this.count = 0;
        }
        
        this.empty = true;
    }

    public setItem(item: Item, count = 1) {
        this.item = item;
        this.count = count;
        this.empty = false;
    }

    public removeItem() {
        this.item = Items.empty;
        this.empty = true;
    }

    public isEmpty() {
        return this.empty;
    }

    public addItems(amount: number): number {
        if(this.item.getMaxStackAmount() < this.count + amount) {
            this.count = this.item.getMaxStackAmount();
            return this.count + amount - this.item.getMaxStackAmount();
        } else {
            this.count = this.count + amount;
            return this.count + amount;
        }
    }

    public getItem(): Item {
        return this.item;
    }
}