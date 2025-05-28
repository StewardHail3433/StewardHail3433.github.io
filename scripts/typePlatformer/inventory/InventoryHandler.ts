import { Camera } from "../camera/Camera.js";
import { Player } from "../entity/player/Player.js";
import { Inventory } from "./Inventory.js";
import { Items } from "../item/Items.js";
import { isInside } from "../utils/Collisions.js";
import { Constants } from "../utils/Constants.js";
import { WorldHandler } from "../world/WorldHandler.js";
import { UIInventory } from "../components/ui/inventory/UIInventory.js";
import { Slot } from "./Slot.js";

export class InventoryHandler {
    private inventories: Inventory[];
    private UIInventories: UIInventory[] = [];
    private mouseItem: {inv: Inventory,index: number, x: number, y: number, holdingItem: boolean} = {inv: new Inventory(0),index:-1,x:0,y:0,holdingItem: false};
    private canvas: HTMLCanvasElement;
    private drop = false;
    private canDrop = false;
    private readonly emptySlot = new Slot();

    constructor(
        canvas: HTMLCanvasElement
    ) {
        this.canvas = canvas;
        this.inventories = [];
    }

    private mouseDown()  {
    
        if(Constants.INPUT_HANDLER.isLeftDown() && Constants.INPUT_HANDLER.wasJustLeftClicked() ) {
            for(let i = 0; i < this.inventories.length; i++) {
                const uiInv = this.UIInventories[i];
                if(isInside(Constants.INPUT_HANDLER.getMousePosition(), {...uiInv.getPlacementBox()}) && !uiInv.ishidden()) { 
                    if(this.inventories[i].getType() == "hotbar" && !this.isMainInventoryOpen()) {
                        uiInv.mouseDownSelction();
                    } else {
                        uiInv.mouseDown(this.mouseItem)
                    }
                    return;
                }
            }
        }
    }

    private mouseMove() {
        if(this.mouseItem.index != -1) {
            this.mouseItem.x = (Constants.INPUT_HANDLER.getMousePosition().x - Constants.TILE_SIZE/2)
            this.mouseItem.y = (Constants.INPUT_HANDLER.getMousePosition().y - Constants.TILE_SIZE/2)
        }

        for(let i = 0; i < this.inventories.length; i++) {
            if(this.inventories[i] == this.mouseItem.inv) { 
                this.UIInventories[i].mouseMove();
            }
        }
    }

    private isMainInventoryOpen() {
        for(let i = 0; i < this.inventories.length; i++) {
            if(this.inventories[i].getType() == "mainInventory" && !this.UIInventories[i].ishidden()) { 
                return true;
            }
        }
        return false;
    }

    public addInventory(inv: Inventory, ui?: UIInventory) {
        for(let i = 0; i < this.inventories.length; i++) {
            if(inv.getType() == this.inventories[i].getType()) {
                this.inventories[i] = inv;
                this.UIInventories[i].setInventory(inv);
                return;
            }
        }
        this.inventories.push(inv);

        switch(inv.getType()) {
            case "hotbar":
                this.UIInventories.push(new UIInventory(this.canvas, inv, {x: 0, y: 18, row: 1, col: 7}, { red: 128, green: 128, blue: 128, alpha: 1.0}, false));
                break;
            case "mainInventory":
                this.UIInventories.push(new UIInventory(this.canvas, inv, {x: 0, y: 36, row: 2, col: 7}, undefined, false));
                break;
            default:
                if(ui) {
                    this.UIInventories.push(ui);
                } else {
                    this.inventories.pop();
                }
        }

    }

    public render(ctx: CanvasRenderingContext2D) {
        for(let i = 0; i < this.inventories.length; i++) {
            this.UIInventories[i].render(ctx);
        }

        for(let i = 0; i < this.inventories.length; i++) {
            this.UIInventories[i].renderMouseItem(ctx);
        }
    }

    public update() {
        this.mouseDown();
        this.mouseMove();
        for(let i = 0; i < this.inventories.length; i++) {
            const uiInv = this.UIInventories[i];
            if(uiInv.ishidden() && this.mouseItem.inv == this.inventories[i] && this.mouseItem.holdingItem) {
                this.mouseItem.index = -1;
                this.mouseItem.holdingItem = false;
                uiInv.update(this.mouseItem);
                break;
            }
        }

        if(this.getHeldSlot().isEmpty()) {
            this.mouseItem.index = -1;
            this.mouseItem.holdingItem = false;
        }
    }

    public getUIInventory(type: string) {
        for(let i = 0; i < this.inventories.length; i++) {
            if(this.inventories[i].getType() == type) {
                return this.UIInventories[i];
            }
        }
    }
    
    public shouldDrop(): boolean {
        return this.drop;
    }

    public setDrop(drop: boolean) {
        this.drop = drop;
    }

    public getHeldSlot(): Slot {
        if (this.mouseItem.holdingItem) {
            return this.mouseItem.inv.getSlot(this.mouseItem.index)
        }
        return this.emptySlot;
    }

    public resetDroppedItem(slot?: Slot) {
        if(this.mouseItem.holdingItem) {
            this.mouseItem.holdingItem = false;
            this.mouseItem.index = -1;
        }
        this.drop = false;
    }

    public setCanDrop(canDrop: boolean) {
        this.canDrop = canDrop;
    }
    

    public getCanDrop(): boolean {
        return this.canDrop;
    }
}