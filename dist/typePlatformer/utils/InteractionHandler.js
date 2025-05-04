import { Inventory } from "../inventory/Inventory.js";
import { containBox, isInside } from "./Collisions.js";
import { Constants } from "./Constants.js";
import { Items } from "../item/Items.js";
import { Tiles } from "../world/Tiles.js";
export class InteractionHandler {
    constructor(player, worldHandler, camera, inventoryHandler) {
        this.player = player;
        this.worldHandler = worldHandler;
        this.camera = camera;
        this.inventoryHandler = inventoryHandler;
        this.inventoryHandler.addInventory(this.player.getHotbarInventory());
        this.inventoryHandler.addInventory(this.player.getMainInventory());
    }
    update(dt) {
        this.controlActions();
        this.checkBreaking();
        this.checkShouldDropItems();
        this.updateWorldHeldItem();
        this.checkPickupItems(dt);
    }
    checkShouldDropItems() {
        if (this.inventoryHandler.shouldDrop()) {
            if (!this.inventoryHandler.getHeldSlot().isEmpty()) {
                this.worldHandler.dropItem(this.inventoryHandler.getHeldSlot(), { x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y) });
            }
            else if (!this.player.getHotbarInventory().getSelecteSlot().isEmpty()) {
                this.worldHandler.dropItem(this.player.getHotbarInventory().getSelecteSlot(), { x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y) });
            }
            this.inventoryHandler.resetDroppedItem();
        }
    }
    updateWorldHeldItem() {
        if (!this.inventoryHandler.getHeldSlot().isEmpty()) {
            this.worldHandler.setHeldItem(this.inventoryHandler.getHeldSlot().getItem());
        }
        else {
            this.worldHandler.setHeldItem(Items.EMPTY);
        }
    }
    controlActions() {
        var _a, _b;
        if (Constants.INPUT_HANDLER.checkControlToggle(this.player.getControls().inventory)) {
            (_a = this.inventoryHandler.getUIInventory("mainInventory")) === null || _a === void 0 ? void 0 : _a.show();
        }
        else {
            (_b = this.inventoryHandler.getUIInventory("mainInventory")) === null || _b === void 0 ? void 0 : _b.hide();
        }
        if (Constants.INPUT_HANDLER.checkControl(this.player.getControls().drop) && this.inventoryHandler.getCanDrop()) {
            this.inventoryHandler.setDrop(true);
            this.inventoryHandler.setCanDrop(false);
        }
        else if (!Constants.INPUT_HANDLER.checkControl(this.player.getControls().drop)) {
            this.inventoryHandler.setCanDrop(true);
        }
        if (Constants.INPUT_HANDLER.checkControl(this.player.getControls().break) && !this.player.getBreaking()) {
            this.setBreakingAtMouse();
        }
        else {
            if (this.player.getBreaking() && !Constants.INPUT_HANDLER.checkControl(this.player.getControls().break)) {
                this.player.setBreaking(false);
                this.worldHandler.clearBreakingTile();
            }
            else if (Constants.INPUT_HANDLER.checkControl(this.player.getControls().break) && this.worldHandler.getBreakingTile()) {
                if (!isInside(Constants.INPUT_HANDLER.getMouseWorldPosition(this.camera), this.worldHandler.getBreakingTile().getHitboxComponent().getHitbox())) {
                    this.setBreakingAtMouse();
                }
            }
        }
        if (Constants.INPUT_HANDLER.checkControl(this.player.getControls().place)) {
            this.checkPlacing();
        }
    }
    setBreakingAtMouse() {
        let tile = this.worldHandler.getWorldTile(Constants.INPUT_HANDLER.getMouseWorldTilePosition(this.camera));
        if (tile.getLayers()[this.player.getLayer()].tile != Tiles.EMPTY) {
            this.player.setBreaking(true);
            this.worldHandler.setBreakingTile(tile);
        }
        else {
            this.player.setBreaking(false);
            this.worldHandler.clearBreakingTile();
        }
    }
    checkBreaking() {
        if (this.player.getBreaking()) {
            if (this.worldHandler.getBreakTime() >= this.worldHandler.getBreakingTile().getLayers()[this.player.getLayer()].tile.getSettings().breakTime) {
                this.worldHandler.breakTile(this.player.getLayer());
                this.player.setBreaking(false);
                return;
            }
            this.worldHandler.updateBreakTime();
        }
    }
    checkPlacing() {
        let tile = this.worldHandler.getWorldTile(Constants.INPUT_HANDLER.getMouseWorldTilePosition(this.camera));
        if (tile.getLayers()[this.player.getLayer()].tile == Tiles.EMPTY) {
            if (!this.inventoryHandler.getHeldSlot().isEmpty()) {
                if (this.inventoryHandler.getHeldSlot().getItem().isABlockItem()) {
                    tile.setLayer(this.player.getLayer(), Tiles.getTileById(this.inventoryHandler.getHeldSlot().getItem().getId()));
                    this.inventoryHandler.getHeldSlot().removeCount(1);
                }
                return;
            }
            if (!this.player.getHotbarInventory().getSelecteSlot().isEmpty()) {
                if (this.player.getHotbarInventory().getSelecteSlot().getItem().isABlockItem()) {
                    tile.setLayer(this.player.getLayer(), Tiles.getTileById(this.player.getHotbarInventory().getSelecteSlot().getItem().getId()));
                    this.player.getHotbarInventory().getSelecteSlot().removeCount(1);
                }
                return;
            }
        }
    }
    checkPickupItems(dt) {
        const droppedItems = this.worldHandler.getDroppedItems();
        for (let i = 0; i < droppedItems.length; i++) {
            let slot = droppedItems[i].getSlot();
            const DIHitbox = droppedItems[i].getHitboxComponent().getHitbox();
            const playerHitbox = this.player.getHitboxComponent().getHitbox();
            if (!containBox(this.camera.getView(), DIHitbox)) {
                continue;
            }
            if (containBox(playerHitbox, droppedItems[i].getHitboxComponent().getHitbox())) {
                const playerHotBar = this.player.getHotbarInventory();
                const playerInv = this.player.getMainInventory();
                slot = Inventory.transferItems(playerHotBar, slot);
                if (slot.getItemCount() != 0) {
                    slot = Inventory.transferItems(playerInv, slot);
                    if (slot.isEmpty()) {
                        droppedItems.splice(i, 1);
                    }
                }
            }
            if (slot.getItemCount() != 0) {
                droppedItems[i].update(dt, {
                    x: playerHitbox.x + playerHitbox.width / 2,
                    y: playerHitbox.y + playerHitbox.height / 2
                });
            }
        }
    }
}
