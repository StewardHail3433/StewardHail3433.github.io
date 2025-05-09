import { Inventory } from "../../../inventory/Inventory.js";
import { Items } from "../../../item/Items.js";
import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
import { UIInventory } from "./UIInventory.js";
export class UIInventories {
    constructor(canvas, camera, worldH) {
        this.UIInventories = [];
        this.mouseItem = { inv: new Inventory(0), index: -1, x: 0, y: 0, holdingItem: false };
        this.drop = false;
        this.canvas = canvas;
        this.camera = camera;
        this.inventories = [];
        this.worldH = worldH;
    }
    mouseDown() {
        if (Constants.INPUT_HANDLER.isMouseDown() && Constants.INPUT_HANDLER.wasJustClicked()) {
            for (let i = 0; i < this.inventories.length; i++) {
                if (isInside(Constants.INPUT_HANDLER.getMousePosition(), Object.assign({}, this.UIInventories[i].getPlacementBox())) && !this.UIInventories[i].ishidden()) {
                    if (this.inventories[i].getType() == "hotbar" && !this.isMainInventoryOpen()) {
                        this.UIInventories[i].mouseDownSelction();
                    }
                    else {
                        this.UIInventories[i].mouseDown(this.mouseItem);
                    }
                    return;
                }
            }
        }
    }
    mouseMove() {
        if (this.mouseItem.index != -1) {
            this.mouseItem.x = (Constants.INPUT_HANDLER.getMousePosition().x - Constants.TILE_SIZE / 2);
            this.mouseItem.y = (Constants.INPUT_HANDLER.getMousePosition().y - Constants.TILE_SIZE / 2);
        }
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i] == this.mouseItem.inv) {
                this.UIInventories[i].mouseMove();
            }
        }
    }
    isMainInventoryOpen() {
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].getType() == "mainInventory" && !this.UIInventories[i].ishidden()) {
                return true;
            }
        }
        return false;
    }
    addInventory(inv, ui) {
        for (let i = 0; i < this.inventories.length; i++) {
            if (inv.getType() == this.inventories[i].getType()) {
                this.inventories[i] = inv;
                this.UIInventories[i].setInventory(inv);
                return;
            }
        }
        this.inventories.push(inv);
        switch (inv.getType()) {
            case "hotbar":
                this.UIInventories.push(new UIInventory(this.canvas, inv, { x: 0, y: 0, row: 1, col: 7 }, { red: 128, green: 128, blue: 128, alpha: 1.0 }, false));
                break;
            case "mainInventory":
                this.UIInventories.push(new UIInventory(this.canvas, inv, { x: 0, y: 18, row: 2, col: 7 }, undefined, false));
                break;
            default:
                if (ui) {
                    this.UIInventories.push(ui);
                }
                else {
                    this.inventories.pop();
                }
        }
    }
    render(ctx) {
        for (let i = 0; i < this.inventories.length; i++) {
            this.UIInventories[i].render(ctx);
        }
        for (let i = 0; i < this.inventories.length; i++) {
            this.UIInventories[i].renderMouseItem(ctx);
        }
    }
    update() {
        if (Constants.INPUT_HANDLER.getKeys()["q"]) {
            this.drop = true;
            Constants.INPUT_HANDLER.getKeys()["q"] = false;
        }
        this.mouseDown();
        this.mouseMove();
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.UIInventories[i].ishidden() && this.mouseItem.inv == this.inventories[i] && this.mouseItem.holdingItem) {
                this.mouseItem.index = -1;
                this.mouseItem.holdingItem = false;
                this.UIInventories[i].update(this.mouseItem);
                break;
            }
        }
        if (this.drop && this.mouseItem.holdingItem) {
            this.worldH.dropItem(this.mouseItem.inv.getSlot(this.mouseItem.index), { x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y) });
            this.drop = false;
            this.mouseItem.holdingItem = false;
            this.mouseItem.index = -1;
        }
        else if (this.drop) {
            for (let i = 0; i < this.inventories.length; i++) {
                if (this.inventories[i].getType() == "hotbar") {
                    if (!this.inventories[i].getSelecteSlot().isEmpty()) {
                        this.worldH.dropItem(this.inventories[i].getSelecteSlot(), { x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y) });
                    }
                    break;
                }
            }
            this.drop = false;
        }
        if (this.mouseItem.holdingItem) {
            this.worldH.setHeldItem(this.mouseItem.inv.getSlot(this.mouseItem.index).getItem());
        }
        else {
            this.worldH.setHeldItem(Items.EMPTY);
        }
    }
    getUIInventory(type) {
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].getType() == type) {
                return this.UIInventories[i];
            }
        }
    }
}
