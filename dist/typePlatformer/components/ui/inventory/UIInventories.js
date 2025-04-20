import { Inventory } from "../../../inventory/Inventory.js";
import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
export class UIInventories {
    constructor(canvas, player) {
        this.mouseItem = { inv: new Inventory(0), index: -1, x: 0, y: 0, holdingItem: false };
        this.scale = 1.0;
        this.canvas = canvas;
        this.player = player;
        this.inventories = [];
        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }
    mouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2); // - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        for (let i = 0; i < this.inventories.length; i++) {
            if (isInside({ x, y }, Object.assign({}, this.inventories[i].getPlacementBox()), this.scale) && !this.inventories[i].ishidden()) {
                if (this.inventories[i].getInventory().getType() == "hotbar" && !this.player.isInventoryOpen()) {
                    this.inventories[i].mouseDownSelction(event);
                }
                else {
                    this.inventories[i].mouseDown(event, this.mouseItem);
                }
                break;
            }
        }
    }
    mouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2); // - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        if (this.mouseItem.index != -1) {
            this.mouseItem.x = (x - Constants.TILE_SIZE / 2) / this.scale;
            this.mouseItem.y = (y - Constants.TILE_SIZE / 2) / this.scale;
        }
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].getInventory() == this.mouseItem.inv) {
                this.inventories[i].mouseMove(event);
            }
        }
    }
    addInventory(inv) {
        this.inventories.push(inv);
    }
    render(ctx) {
        for (let i = 0; i < this.inventories.length; i++) {
            this.inventories[i].render(ctx);
        }
        for (let i = 0; i < this.inventories.length; i++) {
            this.inventories[i].renderMouseItem(ctx);
        }
    }
    update() {
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].ishidden() && this.mouseItem.inv == this.inventories[i].getInventory() && this.mouseItem.holdingItem) {
                this.mouseItem.index = -1;
                this.mouseItem.holdingItem = false;
                this.inventories[i].update(this.mouseItem);
                break;
            }
        }
    }
}
