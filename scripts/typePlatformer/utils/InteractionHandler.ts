import { InventoryHandler } from "../inventory/InventoryHandler.js";
import { Player } from "../entity/player/Player.js";
import { Inventory } from "../inventory/Inventory.js";
import { WorldHandler } from "../world/WorldHandler.js";
import { containBox, isInside } from "./Collisions.js";
import { Constants } from "./Constants.js";
import { Camera } from "../camera/Camera.js";
import { Tiles } from "../world/Tiles.js";
import { WorldTile } from "../world/WorldTile.js";
import { AudioHandler, SFX } from "./audio/AudioHandler.js";

export class InteractionHandler {
    private player: Player;
    private camera: Camera;
    private worldHandler: WorldHandler;
    private inventoryHandler: InventoryHandler;
    
    private interactionCoodown: number = 0.75;
    private interactionCount: number = -this.interactionCoodown;
    constructor(player: Player, worldHandler: WorldHandler, camera: Camera, inventoryHandler: InventoryHandler) {
        this.player = player;
        this.worldHandler = worldHandler;
        this.camera = camera;
        this.inventoryHandler = inventoryHandler;
        this.inventoryHandler.addInventory(this.player.getHotbarInventory());
        this.inventoryHandler.addInventory(this.player.getMainInventory());
    }

    public update(dt: number) {
        if(!this.player.getHealthComponent().isDead()) {
            this.controlActions();
            this.checkBreaking();
            this.checkShouldDropItems();
            this.updateWorldSelectedItem();
            this.checkPickupItems(dt);
        } else {
            this.checkDropInventories()
            this.updateDroppedSlots(dt);
        }
        
    }
    private checkDropInventories() {
        const inv = this.player.getMainInventory();
        const hotbar = this.player.getHotbarInventory();

        for(let i = 0; i < hotbar.getSize(); i++) {
            const slot =hotbar.getSlot(i);
            if(!slot.isEmpty()) {
                this.worldHandler.dropItem(slot,{x: this.player.getHitboxComponent().getHitbox().x, y:this.player.getHitboxComponent().getHitbox().y}, {x: (Math.random()*2 == 2 ? 1 : -1)*(Math.random()*3)*60, y: (Math.random()*2 == 2 ? 1 : -1)*(Math.random()*3)*60});
            }
        }

        for(let i = 0; i < inv.getSize(); i++) {
            const slot = inv.getSlot(i);
            if(!slot.isEmpty()) {
                this.worldHandler.dropItem(slot,{x: this.player.getHitboxComponent().getHitbox().x, y:this.player.getHitboxComponent().getHitbox().y});
            }
        }
    }

    private checkShouldDropItems() {
        if(this.inventoryHandler.shouldDrop()) {
            const heldSlot = this.inventoryHandler.getHeldSlot();
            const selectedSlot = this.player.getHotbarInventory().getSelecteSlot();
            if(!heldSlot.isEmpty()) {
                this.worldHandler.dropItem(heldSlot,{x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y)});
            } else if(!selectedSlot.isEmpty()) {
                this.worldHandler.dropItem(selectedSlot,{x: (Constants.INPUT_HANDLER.getMousePosition().x / this.camera.getView().zoom + this.camera.getView().x), y: (Constants.INPUT_HANDLER.getMousePosition().y / this.camera.getView().zoom + this.camera.getView().y)});
            }
            this.inventoryHandler.resetDroppedItem();
        }
    }

    private updateWorldSelectedItem() {
        const heldSlot = this.inventoryHandler.getHeldSlot();
        const selectedSlot = this.player.getHotbarInventory().getSelecteSlot();
        if (!heldSlot.isEmpty()) {
            this.worldHandler.setSelectedItem(heldSlot.getItem());
        } else {
            this.worldHandler.setSelectedItem(selectedSlot.getItem());
        }
    }

    private controlActions() {
        if(Constants.INPUT_HANDLER.checkControlToggle(this.player.getControls().inventory)) {
            this.inventoryHandler.getUIInventory("mainInventory")?.show();
        } else {
            this.inventoryHandler.getUIInventory("mainInventory")?.hide();
        }

        if(Constants.INPUT_HANDLER.checkControl(this.player.getControls().drop) && this.inventoryHandler.getCanDrop()) {
            this.inventoryHandler.setDrop(true);
            this.inventoryHandler.setCanDrop(false);
        } else if(!Constants.INPUT_HANDLER.checkControl(this.player.getControls().drop)) {
            this.inventoryHandler.setCanDrop(true);
        }

        if(Constants.INPUT_HANDLER.checkControl(this.player.getControls().break) && !this.player.getBreaking()) {
            this.setBreakingAtMouse();
        } else {
            if(this.player.getBreaking() && !Constants.INPUT_HANDLER.checkControl(this.player.getControls().break)) {
                this.player.setBreaking(false);
                this.worldHandler.clearBreakingTile();
            } else if(Constants.INPUT_HANDLER.checkControl(this.player.getControls().break) && this.worldHandler.getBreakingTile()) {
                if(!isInside(Constants.INPUT_HANDLER.getMouseWorldPosition(this.camera), this.worldHandler.getBreakingTile()!.getHitboxComponent().getHitbox())) {
                    this.setBreakingAtMouse();
                }
            }
        }

        if(Constants.INPUT_HANDLER.checkControl(this.player.getControls().place)) {
            this.checkPlacing();
        }

        if(Constants.INPUT_HANDLER.checkControl(this.player.getControls().useItem) && this.interactionCount + this.interactionCoodown <= Constants.TIME_HANDLER.getTime()) {
            this.checkUseItem()
        }
    }

    private checkUseItem() {
        const heldSlot = this.inventoryHandler.getHeldSlot();
        const selectedSlot = this.player.getHotbarInventory().getSelecteSlot();
        if(heldSlot.getItem().getSettings().isConsumable) {
            heldSlot.getItem().getConsumableAction()(this.player);
            heldSlot.removeCount(1);
            this.interactionCount = Constants.TIME_HANDLER.getTime();
        } else if(selectedSlot.getItem().getSettings().isConsumable) {
            selectedSlot.getItem().getConsumableAction()(this.player);
            selectedSlot.removeCount(1);
            this.interactionCount = Constants.TIME_HANDLER.getTime();
        }
    }

    private setBreakingAtMouse() {
        let tile: WorldTile = this.worldHandler.getWorldTile(Constants.INPUT_HANDLER.getMouseWorldTilePosition(this.camera));
        if(tile.getLayers()[this.player.getLayer()].tile != Tiles.EMPTY) {
            this.player.setBreaking(true);
            this.worldHandler.setBreakingTile(tile, this.player.getLayer());
            if(!AudioHandler.getSounds()[SFX.BREAKING_0]?.playing()) {
                AudioHandler.getSounds()[SFX.BREAKING_0]?.loop(true).play();
            }
        } else {
            this.player.setBreaking(false);
            this.worldHandler.clearBreakingTile();
            AudioHandler.getSounds()[SFX.BREAKING_0]?.loop(false).stop();
        }
    }

    private checkBreaking() {
        if(this.player.getBreaking()) {
            if(this.worldHandler.getBreakTime() >= this.worldHandler.getBreakingTile()!.getLayers()[this.player.getLayer()].tile.getSettings().breakTime) {
                this.worldHandler.breakTile(this.player.getLayer());
                this.player.setBreaking(false);
                AudioHandler.getSounds()[SFX.BREAKING_0]?.loop(false).stop();
                AudioHandler.getSounds()[SFX.FINISH_BREKAING_0]?.play();
                return;
            }
            this.worldHandler.updateBreakTime();
        } else {
            AudioHandler.getSounds()[SFX.BREAKING_0]?.loop(false).stop();
        }
    }

    private checkPlacing() {
        let tile: WorldTile = this.worldHandler.getWorldTile(Constants.INPUT_HANDLER.getMouseWorldTilePosition(this.camera));
        if(tile.getLayers()[this.player.getLayer()].tile == Tiles.EMPTY) {
            const heldSlot = this.inventoryHandler.getHeldSlot();
            const selectedSlot = this.player.getHotbarInventory().getSelecteSlot();
            if(!heldSlot.isEmpty()) {
                if(heldSlot.getItem().getSettings().isBlockItem) {
                    tile.setLayer(this.player.getLayer(), Tiles.getTileById(heldSlot.getItem().getId()));
                    heldSlot.removeCount(1);
                    AudioHandler.getSounds()[SFX.PLACE]?.play();
                }
                return;
            }
            if(!selectedSlot.isEmpty()) {
                if(selectedSlot.getItem().getSettings().isBlockItem) {
                    tile.setLayer(this.player.getLayer(), Tiles.getTileById(selectedSlot.getItem().getId()));
                    selectedSlot.removeCount(1);
                    AudioHandler.getSounds()[SFX.PLACE]?.play();
                }
                return;
            }
        }
    }

    private checkPickupItems(dt: number) {
        const droppedItems = this.worldHandler.getDroppedItems();

        for(let i = 0; i < droppedItems.length; i++) {
            let slot = droppedItems[i].getSlot();
            const DIHitbox = droppedItems[i].getHitboxComponent().getHitbox()
            const playerHitbox = this.player.getHitboxComponent().getHitbox()

            if(!containBox(this.camera.getView(), DIHitbox)) {
                continue;
            }
            if(containBox(playerHitbox, droppedItems[i].getHitboxComponent().getHitbox())) {
                const playerHotBar = this.player.getHotbarInventory();
                const playerInv = this.player.getMainInventory();

                slot = Inventory.transferItems(playerHotBar, slot);
                if (slot.getItemCount() != 0) {
                    slot = Inventory.transferItems(playerInv, slot);    
                }

                if(slot.isEmpty()) {
                    droppedItems.splice(i, 1);
                    AudioHandler.getSounds()[SFX.PICKUP]?.play();
                }
            }

            if (slot.getItemCount() != 0) {
                this.updateDroppedSlots(dt, {
                    x: playerHitbox.x + playerHitbox.width / 2,
                    y: playerHitbox.y + playerHitbox.height / 2
                }, i)
            }

        } 
    }

    private updateDroppedSlots(dt: number, attactionPt?: {x: number, y: number}, index?: number) {
        const droppedItems = this.worldHandler.getDroppedItems();
        if(index){
            if(attactionPt) {
                droppedItems[index].update(dt, attactionPt)
            } else {
                droppedItems[index].update(dt)
            }
            return
        } 

        if(attactionPt) {
            for(let i = 0; i < droppedItems.length; i++) {
                droppedItems[i].update(dt, attactionPt)
            }
        } else {
            for(let i = 0; i < droppedItems.length; i++) {
                droppedItems[i].update(dt)
            }
        }
    }
}