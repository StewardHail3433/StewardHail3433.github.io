import { Inventory } from "../../../inventory/Inventory.js";
import { Items } from "../../../item/items.js";
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

        document.addEventListener("mousedown", this.mousDown.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
        document.addEventListener("mouseup", this.mouseUp.bind(this));
    }

    private mousDown(event: MouseEvent)  {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);

        for(let i = 0; i < this.inventory.getSize(); i++) {
            if(!this.inventory.getSlot(i).isEmpty() && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                this.mouseItem.index = i;
            }
        }
    }


    private mouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        console.log(this.mouseItem.index)
        if(this.mouseItem.index != -1) {
            this.mouseItem.x = x - Constants.TILE_SIZE/2;
            this.mouseItem.y = y - Constants.TILE_SIZE/2;
        } else {
            for(let i = 0; i < this.inventory.getSize(); i++) {
                if(!this.inventory.getSlot(i).isEmpty() && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                    console.log("hi");
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
                if(this.inventory.getSlot(i).isEmpty() && isInside({x, y}, {...this.slotPlacement[i], width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale,) && i != this.mouseItem.index) {
                    this.inventory.getSlot(i).setItem(this.inventory.getSlot(this.mouseItem.index).getItem());
                    this.inventory.getSlot(this.mouseItem.index).setItem(Items.empty, 0);
                    this.mouseItem.index = -1;

                    break;
                } else {
                    this.discription.hide();
                }
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        // Get device pixel ratio
                // const dpr = window.devicePixelRatio || 1;
        
                // // // Set actual canvas size in memory (higher resolution)
                // this.canvas.width = Constants.CANVAS_WIDTH * dpr;
                // this.canvas.height = Constants.CANVAS_HEIGHT * dpr;
        
                // // Style it to look the same on screen
                // this.canvas.style.width = `${Constants.CANVAS_WIDTH}px`;
                // this.canvas.style.height = `${Constants.CANVAS_HEIGHT}px`;
        
                // // Scale context to account for DPR
        for(let i = 0; i < this.inventory.getSize(); i++) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y, Constants.TILE_SIZE, Constants.TILE_SIZE);
            if(!this.inventory.getSlot(i).isEmpty()) {
                if(this.mouseItem.index == -1) {
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
                } else {
                    if(this.mouseItem.index =i) {
                        if(this.inventory.getSlot(i).getItem().getImage()) {
                            ctx.drawImage(this.inventory.getSlot(i).getItem().getImage()!, this.mouseItem.x, this.mouseItem.y);
                        } else {
                            ctx.fillStyle = "#FF13F0";
                            ctx.fillRect(this.mouseItem.x, this.mouseItem.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillRect(this.mouseItem.x+Constants.TILE_SIZE/2, this.mouseItem.y +Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillStyle = "rgb(0,0,0)";
                            ctx.fillRect(this.mouseItem.x, this.mouseItem.y+Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillRect(this.mouseItem.x+Constants.TILE_SIZE/2, this.mouseItem.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                        }
                    }
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
        this.discription.render(ctx);
    }

    public updatePosition(scale: number) {
        this.scale = scale;
        this.discription.updatePosition(scale);
    }
}