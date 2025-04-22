import { Inventory } from "../../../inventory/Inventory.js";
import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
export class UIInventories {
    constructor(canvas, player, camera, worldH) {
        this.mouseItem = { inv: new Inventory(0), index: -1, x: 0, y: 0, holdingItem: false };
        this.scale = 1.0;
        this.drop = false;
        this.canvas = canvas;
        this.player = player;
        this.camera = camera;
        this.inventories = [];
        this.worldH = worldH;
        document.addEventListener("keydown", (event) => {
            if (event.key === "q") {
                this.drop = true;
            }
        });
    }
    mouseDown() {
        if (Constants.INPUT_HANDLER.isMouseDown() && Constants.INPUT_HANDLER.wasJustClicked()) {
            for (let i = 0; i < this.inventories.length; i++) {
                if (isInside(Constants.INPUT_HANDLER.getMousePosition(), Object.assign({}, this.inventories[i].getPlacementBox()), this.scale) && !this.inventories[i].ishidden()) {
                    if (this.inventories[i].getInventory().getType() == "hotbar" && !this.player.isInventoryOpen()) {
                        this.inventories[i].mouseDownSelction();
                    }
                    else {
                        this.inventories[i].mouseDown(this.mouseItem);
                    }
                    return;
                }
            }
        }
    }
    mouseMove() {
        if (this.mouseItem.index != -1) {
            this.mouseItem.x = (Constants.INPUT_HANDLER.getMousePosition().x - Constants.TILE_SIZE / 2) / this.scale;
            this.mouseItem.y = (Constants.INPUT_HANDLER.getMousePosition().y - Constants.TILE_SIZE / 2) / this.scale;
        }
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].getInventory() == this.mouseItem.inv) {
                this.inventories[i].mouseMove();
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
        this.mouseDown();
        this.mouseMove();
        for (let i = 0; i < this.inventories.length; i++) {
            if (this.inventories[i].ishidden() && this.mouseItem.inv == this.inventories[i].getInventory() && this.mouseItem.holdingItem) {
                this.mouseItem.index = -1;
                this.mouseItem.holdingItem = false;
                this.inventories[i].update(this.mouseItem);
                break;
            }
        }
        if (this.drop && this.mouseItem.holdingItem) {
            this.worldH.dropItem(this.mouseItem.inv.getSlot(this.mouseItem.index), { x: Constants.INPUT_HANDLER.getMousePosition().x / this.scale + this.camera.getView().x, y: Constants.INPUT_HANDLER.getMousePosition().y / this.scale + this.camera.getView().y });
            this.drop = false;
            this.mouseItem.holdingItem = false;
            this.mouseItem.index = -1;
        }
        else if (this.drop) {
            for (let i = 0; i < this.inventories.length; i++) {
                if (this.inventories[i].getInventory().getType() == "hotbar") {
                    if (!this.inventories[i].getInventory().getSelecteSlot().isEmpty()) {
                        this.worldH.dropItem(this.inventories[i].getInventory().getSelecteSlot(), { x: Constants.INPUT_HANDLER.getMousePosition().x / this.scale + this.camera.getView().x, y: Constants.INPUT_HANDLER.getMousePosition().y / this.scale + this.camera.getView().y });
                    }
                    break;
                }
            }
            this.drop = false;
        }
    }
    updateScale(scale) {
        this.scale = scale;
    }
}
