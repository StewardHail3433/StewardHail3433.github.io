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
    private mouseDown = false;
    private canvas: HTMLCanvasElement;
    private scale: number = 1.0;
    private discription: UIComponentLabel;
    private slotPlacement: {x: number, y: number}[] = [];
    private mouseItem: {index: number, x: number, y: number} = {index:-1,x:0,y:0};
    private holdingItem: boolean;

    constructor(
        canvas: HTMLCanvasElement,
        inventory: Inventory,
        placement: {x: number; y: number; row: number; col: number}, 
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
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

        document.addEventListener("mousedown", this.mousDown.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        // document.addEventListener("mouseup", this.mouseUp.bind(this));
    }

    private mousDown(event: MouseEvent)  {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);

        for(let i = 0; i < this.inventory.getSize(); i++) {
                if(this.holdingItem == false) {
                    if(!this.inventory.getSlot(i).isEmpty() && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                        this.mouseItem.index = i;
                        this.mouseItem.x = (x - Constants.TILE_SIZE/2)/this.scale;
                        this.mouseItem.y = (y - Constants.TILE_SIZE/2)/this.scale;
                        this.holdingItem =  true;
                        this.discription.hide();
                    }
                } else {
                    // this.mouseItem.index = -1;
                    // (this.inventory.getSlot(i).isEmpty() || this.inventory.getSlot(i).getItem().getId() == this.inventory.getSlot(this.mouseItem.index).getItem().getId()) && i != this.mouseItem.index
                    if(isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                        if(i == this.mouseItem.index) {
                            this.mouseItem.index = -1;
                            this.holdingItem = false;
                        } else if(this.inventory.getSlot(i).isEmpty()) {
                            this.inventory.getSlot(i).setItem(this.inventory.getSlot(this.mouseItem.index).getItem(), this.inventory.getSlot(this.mouseItem.index).getItemCount());
                            this.inventory.getSlot(this.mouseItem.index).removeItem();
                            this.mouseItem.index = -1;
                            this.holdingItem = false;
                        } else if(this.inventory.getSlot(i).getItem().getId() == this.inventory.getSlot(this.mouseItem.index).getItem().getId()) {
                            if(this.inventory.getSlot(i).getItemCount() != this.inventory.getSlot(i).getMaxItemCount()) {
                                let amount = 0;
                                amount = this.inventory.getSlot(i).addItems(this.inventory.getSlot(this.mouseItem.index).getItemCount());
                                if(amount > 0) {
                                    this.inventory.getSlot(this.mouseItem.index).setItem(this.inventory.getSlot(this.mouseItem.index).getItem(), amount);
                                } else {
                                    this.inventory.getSlot(this.mouseItem.index).removeItem();
                                    this.mouseItem.index = -1;
                                    this.holdingItem = false;
                                    break;
                                }
                            } else {
                                let c = this.inventory.getSlot(this.mouseItem.index).getItemCount();
                                let item = this.inventory.getSlot(this.mouseItem.index).getItem();

                                this.inventory.getSlot(this.mouseItem.index).setItem(this.inventory.getSlot(i).getItem(), this.inventory.getSlot(i).getItemCount());
                                this.inventory.getSlot(i).setItem(item, c);
                            }
                        } else {
                            let c = this.inventory.getSlot(this.mouseItem.index).getItemCount();
                            let item = this.inventory.getSlot(this.mouseItem.index).getItem();

                            this.inventory.getSlot(this.mouseItem.index).setItem(this.inventory.getSlot(i).getItem(), this.inventory.getSlot(i).getItemCount());
                            this.inventory.getSlot(i).setItem(item, c);
                        }
                    }
                }
            }
    }


    private mouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        if(this.mouseItem.index != -1) {
            this.mouseItem.x = (x - Constants.TILE_SIZE/2)/this.scale;
            this.mouseItem.y = (y - Constants.TILE_SIZE/2)/this.scale;
        } else {
            for(let i = 0; i < this.inventory.getSize(); i++) {
                if(!this.inventory.getSlot(i).isEmpty() && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                    this.discription.setHitbox({...this.discription.getHitbox(), x:x/this.scale, y:y/this.scale});
                    this.discription.update(this.inventory.getSlot(i).getItem().getDiscription());
                    this.discription.show();
                    break;
                } else {
                    this.discription.hide();
                }
            }
        }
    }


    private mouseUp(event: MouseEvent) { 
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        if(this.mouseItem.index != -1) {
            for(let i = 0; i < this.inventory.getSize(); i++) {
                if((this.inventory.getSlot(i).isEmpty() || this.inventory.getSlot(i).getItem().getId() == this.inventory.getSlot(this.mouseItem.index).getItem().getId()) && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale,) && i != this.mouseItem.index) {
                    let amount = 0
                    if(this.inventory.getSlot(i).isEmpty()) {
                        this.inventory.getSlot(i).setItem(this.inventory.getSlot(this.mouseItem.index).getItem(), this.inventory.getSlot(this.mouseItem.index).getItemCount());

                    } else {
                        amount = this.inventory.getSlot(i).addItems(this.inventory.getSlot(this.mouseItem.index).getItemCount());
                    }
                    if(amount > 0) {
                        this.inventory.getSlot(this.mouseItem.index).setItem(this.inventory.getSlot(this.mouseItem.index).getItem(), amount);
                    } else {
                        this.inventory.getSlot(this.mouseItem.index).removeItem();
                    }
                    this.mouseItem.index = -1;
                    return;
                }
            }
            this.mouseItem.index = -1;
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        const textSpacing = 2; 
        const fontSize = 10;
        for(let i = 0; i < this.inventory.getSize(); i++) {
            ctx.fillStyle = "purple";
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

        this.inventory.getSelecteSlotIndex();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(
            (this.inventory.getSelecteSlotIndex() % this.placement.col) * Constants.TILE_SIZE + (this.inventory.getSelecteSlotIndex() % this.placement.col) *2 + ctx.lineWidth,
            Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*Constants.TILE_SIZE + Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*2 + ctx.lineWidth,
            Constants.TILE_SIZE+2,
            Constants.TILE_SIZE+2
        )

        if(this.mouseItem.index != -1) {
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

        
        this.discription.render(ctx);
    }

    public updatePosition(scale: number) {
        this.scale = scale;
        this.discription.updatePosition(scale);
    }
}