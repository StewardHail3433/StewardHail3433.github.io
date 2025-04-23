import { Inventory } from "../../../inventory/Inventory.js";
import { Items } from "../../../item/Items.js";
import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
import { ImageLoader } from "../../../utils/ImageLoader.js";
import { UIComponentLabel } from "../UIComponentLabel.js";

export class UIInventory {
    private hidden: boolean;
    private color: {red: number; green: number; blue: number; alpha?: number};
    private placement: {x: number; y: number; row: number; col: number};
    private inventory: Inventory;
    private canvas: HTMLCanvasElement;
    private scale: number = 1.0;
    private discription: UIComponentLabel;
    private slotPlacement: {x: number, y: number}[] = [];
    private mouseItem: {inv: Inventory, index: number, x: number, y: number, holdingItem: boolean} = {inv: new Inventory(0), index:-1,x:0,y:0, holdingItem: false};
    private holdingItem: boolean;

    constructor(
        canvas: HTMLCanvasElement,
        inventory: Inventory,
        placement: {x: number; y: number; row: number; col: number}, 
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 128, green: 0, blue: 128, alpha: 1.0}, 
        hidden: boolean
    ) {
        this.canvas = canvas;
        this.inventory = inventory;
        this.placement = placement;
        this.color = color
        this.hidden = hidden;
        this.discription = new UIComponentLabel({x:0,y:0,width:100,height:25},{red:128, green:128, blue:128, alpha:0.25},true, undefined, {red:255, green:255, blue:255, alpha: 1.0},10,"left",false)

        let slotX = this.placement.x;
        let slotY = this.placement.y;
        let size = 0;
        let spacing = 2;
        col:
        for(let i = 0; i < this.placement.row; i++) {
            slotY += spacing;
            row:
            for(let j = 0; j < this.placement.col; j++) {
                size++;
                if(size <= this.inventory.getSize()) {
                    slotX += spacing;
                    this.slotPlacement.push({x: slotX, y: slotY});
                    slotX += Constants.TILE_SIZE;
                } else {
                    this.placement.row = i;
                    break;
                }
            }
            slotX = 0;
            slotY += Constants.TILE_SIZE;
        }
        this.holdingItem = false;
        this.mouseItem.inv = inventory;
    }

    public mouseDown(mouseItem: {inv: Inventory, index: number, x: number, y: number, holdingItem: boolean})  {
        for(let i = 0; i < this.inventory.getSize(); i++) {
            if(mouseItem.holdingItem == false) {
                // if(!this.inventory.getSlot(i).isEmpty()) console.log(Constants.INPUT_HANDLER.getMousePosition(), this.slotPlacement[i])
                if(!this.inventory.getSlot(i).isEmpty() && isInside(Constants.INPUT_HANDLER.getMousePosition(), {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                    mouseItem.index = i;
                    mouseItem.x = (Constants.INPUT_HANDLER.getMousePosition().x - Constants.TILE_SIZE/2)/this.scale;
                    mouseItem.y = (Constants.INPUT_HANDLER.getMousePosition().y - Constants.TILE_SIZE/2)/this.scale;
                    mouseItem.inv = this.inventory;
                    mouseItem.holdingItem =  true;
                    this.holdingItem = true
                    this.discription.hide();
                }
            } else {
                if(isInside(Constants.INPUT_HANDLER.getMousePosition(), {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                    if(i == mouseItem.index && this.mouseItem.inv == this.inventory) {
                        mouseItem.index = -1;
                        mouseItem.holdingItem = false;
                        this.holdingItem = false;
                        mouseItem.inv = this.inventory;
                    } else if(this.inventory.getSlot(i).isEmpty()) {
                        this.inventory.getSlot(i).setItem(mouseItem.inv.getSlot(mouseItem.index).getItem(), mouseItem.inv.getSlot(mouseItem.index).getItemCount());
                        mouseItem.inv.getSlot(mouseItem.index).removeItem();
                        mouseItem.index = -1;
                        mouseItem.holdingItem = false;
                        this.holdingItem = false;
                        mouseItem.inv = this.inventory;
                    } else if(this.inventory.getSlot(i).getItem().getId() == mouseItem.inv.getSlot(mouseItem.index).getItem().getId()) {
                        if(this.inventory.getSlot(i).getItemCount() != this.inventory.getSlot(i).getMaxItemCount()) {
                            let amount = 0;
                            amount = this.inventory.getSlot(i).addItems(mouseItem.inv.getSlot(mouseItem.index).getItemCount());
                            if(amount > 0) {
                                mouseItem.inv.getSlot(mouseItem.index).setItem(mouseItem.inv.getSlot(mouseItem.index).getItem(), amount);
                                mouseItem.inv = this.inventory;
                            } else {
                                mouseItem.inv.getSlot(mouseItem.index).removeItem();
                                mouseItem.index = -1;
                                mouseItem.holdingItem = false;
                                this.holdingItem = false;
                                mouseItem.inv = this.inventory;
                                break;
                            }
                        } else {
                            let c = mouseItem.inv.getSlot(mouseItem.index).getItemCount();
                            let item = mouseItem.inv.getSlot(mouseItem.index).getItem();

                            mouseItem.inv.getSlot(mouseItem.index).setItem(this.inventory.getSlot(i).getItem(), this.inventory.getSlot(i).getItemCount());
                            this.inventory.getSlot(i).setItem(item, c);
                            mouseItem.inv = this.inventory;
                        }
                    } else {
                        let c = mouseItem.inv.getSlot(mouseItem.index).getItemCount();
                        let item = mouseItem.inv.getSlot(mouseItem.index).getItem();

                        mouseItem.inv.getSlot(mouseItem.index).setItem(this.inventory.getSlot(i).getItem(), this.inventory.getSlot(i).getItemCount());
                        this.inventory.getSlot(i).setItem(item, c);
                        mouseItem.inv = this.inventory;
                    }
                }
            }
        }
        this.mouseItem = mouseItem;
    }

    public mouseDownSelction() {
        for(let i = 0; i < this.inventory.getSize(); i++) {
            if(isInside(Constants.INPUT_HANDLER.getMousePosition(), {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                this.inventory.setSelecteSlot(i);
                break;
            }
        }
    }


    public mouseMove() {
        if(this.mouseItem.index == -1) {
            for(let i = 0; i < this.inventory.getSize(); i++) {
                if(!this.inventory.getSlot(i).isEmpty() && isInside(Constants.INPUT_HANDLER.getMousePosition(), {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                    this.discription.setHitbox({...this.discription.getHitbox(), x:Constants.INPUT_HANDLER.getMousePosition().x/this.scale, y:Constants.INPUT_HANDLER.getMousePosition().y/this.scale});
                    this.discription.update(this.inventory.getSlot(i).getItem().getDiscription());
                    this.discription.show();
                    break;
                } else {
                    this.discription.hide();
                }
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(this.hidden) {
            return;
        }
        const textSpacing = 2; 
        const fontSize = 10;
        ctx.imageSmoothingEnabled = false;
        for(let i = 0; i < this.inventory.getSize(); i++) {
            ctx.fillStyle = "rgba(" + this.color.red + ", " + this.color.green + ", " + this.color.blue + ", " + this.color.alpha + ")";
            ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y, Constants.TILE_SIZE, Constants.TILE_SIZE);
            if(!this.inventory.getSlot(i).isEmpty()) {
                if(this.mouseItem.index != i) {
                    if(this.inventory.getSlot(i).getItem().getImage()) {
                        ctx.drawImage(this.inventory.getSlot(i).getItem().getImage()!, this.slotPlacement[i].x, this.slotPlacement[i].y);
                    } else {
                        ctx.fillStyle = "#FF13F0";
                        ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                        ctx.fillRect(this.slotPlacement[i].x+Constants.TILE_SIZE/2, this.slotPlacement[i].y +Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                        ctx.fillStyle = "rgb(0,0,0)";
                        ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y+Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                        ctx.fillRect(this.slotPlacement[i].x+Constants.TILE_SIZE/2, this.slotPlacement[i].y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                    }
                    ctx.fillStyle = "white";
                    ctx.font = fontSize+ "px serif";
                    ctx.fillText(this.inventory.getSlot(i).getItemCount().toString(), this.slotPlacement[i].x + textSpacing, this.slotPlacement[i].y + Constants.TILE_SIZE - textSpacing - ctx.lineWidth);
                }
            }
        }

        if(this.inventory.getType() == "hotbar") {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(
                (this.inventory.getSelecteSlotIndex() % this.placement.col) * Constants.TILE_SIZE + (this.inventory.getSelecteSlotIndex() % this.placement.col) *2 + ctx.lineWidth,
                Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*Constants.TILE_SIZE + Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*2 + ctx.lineWidth,
                Constants.TILE_SIZE+2,
                Constants.TILE_SIZE+2
            )
        }

        
        this.discription.render(ctx);
    }

    renderMouseItem(ctx: CanvasRenderingContext2D) {
        const textSpacing = 2; 
        const fontSize = 10;
        ctx.imageSmoothingEnabled = false;
        if(this.mouseItem.index != -1 && this.mouseItem.inv == this.inventory) {
            if(this.inventory.getSlot(this.mouseItem.index).getItem().getImage()) {
                ctx.drawImage(this.inventory.getSlot(this.mouseItem.index).getItem().getImage()!, this.mouseItem.x, this.mouseItem.y);
            } else {
                ctx.fillStyle = "#FF13F0";
                ctx.fillRect(this.mouseItem.x, this.mouseItem.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                ctx.fillRect(this.mouseItem.x+Constants.TILE_SIZE/2, this.mouseItem.y +Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(this.mouseItem.x, this.mouseItem.y+Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                ctx.fillRect(this.mouseItem.x+Constants.TILE_SIZE/2, this.mouseItem.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
            }
            ctx.fillStyle = "white";
            ctx.font = fontSize+ "px serif";
            ctx.fillText(this.inventory.getSlot(this.mouseItem.index).getItemCount().toString(), this.mouseItem.x + textSpacing, this.mouseItem.y + Constants.TILE_SIZE - textSpacing - ctx.lineWidth);
        }
    }

    public updatePosition(scale: number) {
        this.scale = scale;
        console.log(scale);
        this.discription.updatePosition(scale);
    }

    public getPlacementBox(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.placement.x,
            y: this.placement.y,
            width: this.placement.col * Constants.TILE_SIZE + (this.placement.col - 1) * 2,
            height: this.placement.row * Constants.TILE_SIZE + (this.placement.row - 1) * 2
        };
    }

    public getInventory(): Inventory {
        return this.inventory;
    }

    public hide() {
        this.hidden = true;
    }

    public show() {
        this.hidden = false;
    }
    
    public ishidden() {
        return this.hidden;
    }

    public update(mI: {inv: Inventory,index: number, x: number, y: number, holdingItem: boolean}) {
        this.mouseItem = mI;
    }
}