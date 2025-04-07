import { Inventory } from "../../../inventory/Inventory.js";
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

        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }


    private mouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
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
                    if(!this.inventory.getSlot(i*this.placement.col + j).isEmpty() && isInside({x, y}, {x: slotX, y: slotY, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE}, this.scale)) {
                        console.log("hi");
                        this.discription.setHitbox({...this.discription.getHitbox(), x:x/this.scale, y:y/this.scale});
                        this.discription.update(this.inventory.getSlot(i*this.placement.col + j).getItem().getDiscription());
                        this.discription.show();
                        break col;
                    } else {
                        this.discription.hide();
                    }
                    slotX += Constants.TILE_SIZE;
                } else {
                    this.placement.row = i;
                    break;
                }
            }
            slotX = 0;
            slotY += Constants.TILE_SIZE;
        }
    }


    public render(ctx: CanvasRenderingContext2D) {
        let x = this.placement.x;
        let y = this.placement.y;
        let size = 0;
        let spacing = 2
        for(let i = 0; i < this.placement.row; i++) {
            y += spacing;
            for(let j = 0; j < this.placement.col; j++) {
                size++;
                if(size <= this.inventory.getSize()) {
                    x += spacing;
                    ctx.fillStyle = "purple";
                    ctx.fillRect(x, y, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    if(!this.inventory.getSlot(i*this.placement.col + j).isEmpty()) {
                        if(this.inventory.getSlot(i*this.placement.col + j).getItem().getImage()) {
                            ctx.drawImage(this.inventory.getSlot(i*this.placement.col + j).getItem().getImage()!, x, y);
                        } else {
                            ctx.fillStyle = "#FF13F0";
                            ctx.fillRect(x, y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillRect(x+Constants.TILE_SIZE/2, y +Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillStyle = "rgb(0,0,0)";
                            ctx.fillRect(x, y+Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                            ctx.fillRect(x+Constants.TILE_SIZE/2, y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                        }
                    }
                    x += Constants.TILE_SIZE;
                } else {
                    this.placement.row = i;
                    break;
                }
            }
            x = 0;
            y += Constants.TILE_SIZE;
        }

        this.inventory.getSelecteSlotIndex();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(
            (this.inventory.getSelecteSlotIndex() % this.placement.col) * Constants.TILE_SIZE + (this.inventory.getSelecteSlotIndex() % this.placement.col) *spacing + ctx.lineWidth,
            Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*Constants.TILE_SIZE + Math.floor(this.inventory.getSelecteSlotIndex()%this.placement.row)*spacing + ctx.lineWidth,
            Constants.TILE_SIZE+spacing,
            Constants.TILE_SIZE+spacing
        )
        this.discription.render(ctx);
    }

    public updatePosition(scale: number) {
        this.scale = scale;
        this.discription.updatePosition(scale);
    }
}