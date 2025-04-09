import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
import { UIComponentLabel } from "../UIComponentLabel.js";
export class UIInventory {
    constructor(canvas, inventory, placement, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden) {
        this.mouseDown = false;
        this.scale = 1.0;
        this.slotPlacement = [];
        this.canvas = canvas;
        this.inventory = inventory;
        this.placement = placement;
        this.color = color;
        this.hidden = hidden;
        this.discription = new UIComponentLabel({ x: 0, y: 0, width: 100, height: 25 }, { red: 128, green: 128, blue: 128, alpha: 0.25 }, true, undefined, { red: 255, green: 255, blue: 255, alpha: 1.0 }, 10, "left", false);
        let slotX = this.placement.x;
        let slotY = this.placement.y;
        let size = 0;
        let spacing = 2;
        col: for (let i = 0; i < this.placement.row; i++) {
            slotY += spacing;
            row: for (let j = 0; j < this.placement.col; j++) {
                size++;
                if (size <= this.inventory.getSize()) {
                    slotX += spacing;
                    this.slotPlacement.push({ x: slotX, y: slotY });
                    slotX += Constants.TILE_SIZE;
                }
                else {
                    this.placement.row = i;
                    break;
                }
            }
            slotX = 0;
            slotY += Constants.TILE_SIZE;
        }
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }
    mouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2); // - offest
        let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        for (let i = 0; i < this.inventory.getSize(); i++) {
            if (!this.inventory.getSlot(i).isEmpty() && isInside({ x, y }, Object.assign(Object.assign({}, this.slotPlacement[i]), { width: Constants.TILE_SIZE, height: Constants.TILE_SIZE }), this.scale)) {
                console.log("hi");
                this.discription.setHitbox(Object.assign(Object.assign({}, this.discription.getHitbox()), { x: x / this.scale, y: y / this.scale }));
                this.discription.update(this.inventory.getSlot(i).getItem().getDiscription());
                this.discription.show();
                break;
            }
            else {
                this.discription.hide();
            }
        }
    }
    render(ctx) {
        // Get device pixel ratio
        // const dpr = window.devicePixelRatio || 1;
        // // // Set actual canvas size in memory (higher resolution)
        // this.canvas.width = Constants.CANVAS_WIDTH * dpr;
        // this.canvas.height = Constants.CANVAS_HEIGHT * dpr;
        // // Style it to look the same on screen
        // this.canvas.style.width = `${Constants.CANVAS_WIDTH}px`;
        // this.canvas.style.height = `${Constants.CANVAS_HEIGHT}px`;
        // // Scale context to account for DPR
        for (let i = 0; i < this.inventory.getSize(); i++) {
            ctx.fillStyle = "purple";
            ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y, Constants.TILE_SIZE, Constants.TILE_SIZE);
            if (!this.inventory.getSlot(i).isEmpty()) {
                if (this.inventory.getSlot(i).getItem().getImage()) {
                    ctx.drawImage(this.inventory.getSlot(i).getItem().getImage(), this.slotPlacement[i].x, this.slotPlacement[i].y);
                }
                else {
                    ctx.fillStyle = "#FF13F0";
                    ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                    ctx.fillRect(this.slotPlacement[i].x + Constants.TILE_SIZE / 2, this.slotPlacement[i].y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                    ctx.fillStyle = "rgb(0,0,0)";
                    ctx.fillRect(this.slotPlacement[i].x, this.slotPlacement[i].y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                    ctx.fillRect(this.slotPlacement[i].x + Constants.TILE_SIZE / 2, this.slotPlacement[i].y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                }
            }
        }
        this.inventory.getSelecteSlotIndex();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect((this.inventory.getSelecteSlotIndex() % this.placement.col) * Constants.TILE_SIZE + (this.inventory.getSelecteSlotIndex() % this.placement.col) * 2 + ctx.lineWidth, Math.floor(this.inventory.getSelecteSlotIndex() % this.placement.row) * Constants.TILE_SIZE + Math.floor(this.inventory.getSelecteSlotIndex() % this.placement.row) * 2 + ctx.lineWidth, Constants.TILE_SIZE + 2, Constants.TILE_SIZE + 2);
        this.discription.render(ctx);
    }
    updatePosition(scale) {
        this.scale = scale;
        this.discription.updatePosition(scale);
    }
}
