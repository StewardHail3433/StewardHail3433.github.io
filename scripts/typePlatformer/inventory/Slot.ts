import { Item } from "../item/Item.js";
import { Items } from "../item/Items.js";

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
            this.empty = false;
        } else {
            this.item = Items.EMPTY;
            this.count = 0;
            this.empty = true;
        }
    }

    public setItem(item: Item, count: number) {
        this.item = item;
        this.count = count;
        this.empty = false;
    }

    public removeItem() {
        this.item = Items.EMPTY;
        this.count = 0;
        this.empty = true;
    }

    public removeCount(num: number) {
        this.count -= num;
        if(this.count <= 0) {
            this.item = Items.EMPTY;
            this.count = 0;
            this.empty = true;
        }
    }

    public isEmpty() {
        return this.empty;
    }

    public addItems(amount: number): number {
        let c = this.count;
        if(this.item.getMaxStackAmount() < c + amount) {
            this.count = this.item.getMaxStackAmount();
            return c + amount - this.item.getMaxStackAmount();
        } else {
            this.count = this.count + amount;
            return 0;
        }
    }

    public getItem(): Item {
        return this.item;
    }

    public getItemCount(): number {
        return this.count;
    }
    public getMaxItemCount() {
        return this.item.getMaxStackAmount()
    }
}