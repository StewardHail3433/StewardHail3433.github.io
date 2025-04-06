import { Constants } from "../../../utils/Constants.js";
export class UIInventory {
    constructor(inventory, placement, color = { red: 255, green: 0, blue: 255, alpha: 1.0 }, hidden) {
        this.inventory = inventory;
        this.placement = placement;
        this.color = color;
        this.hidden = hidden;
    }
    render(ctx) {
        let x = 0;
        let y = 0;
        let size = 0;
        let spacing = 2;
        for (let i = 0; i < this.placement.row; i++) {
            y += spacing;
            for (let j = 0; j < this.placement.col; j++) {
                size++;
                if (size <= this.inventory.getSize()) {
                    x += spacing;
                    ctx.fillStyle = "purple";
                    ctx.fillRect(x, y, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    if (!this.inventory.getSlot(i * this.placement.col + j).isEmpty()) {
                        if (this.inventory.getSlot(i * this.placement.col + j).getItem().getImage()) {
                            ctx.drawImage(this.inventory.getSlot(i * this.placement.col + j).getItem().getImage(), x, y);
                        }
                        else {
                            ctx.fillStyle = "#FF13F0";
                            ctx.fillRect(x, y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                            ctx.fillRect(x + Constants.TILE_SIZE / 2, y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                            ctx.fillStyle = "rgb(0,0,0)";
                            ctx.fillRect(x, y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                            ctx.fillRect(x + Constants.TILE_SIZE / 2, y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                        }
                    }
                    x += Constants.TILE_SIZE;
                }
                else {
                    this.placement.row = i;
                    break;
                }
            }
            x = 0;
            y += Constants.TILE_SIZE;
        }
        this.inventory.getSelecteSlotIndex();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect((this.inventory.getSelecteSlotIndex() % this.placement.col) * Constants.TILE_SIZE + (this.inventory.getSelecteSlotIndex() % this.placement.col) * spacing + ctx.lineWidth, Math.floor(this.inventory.getSelecteSlotIndex() % this.placement.row) * Constants.TILE_SIZE + Math.floor(this.inventory.getSelecteSlotIndex() % this.placement.row) * spacing + ctx.lineWidth, Constants.TILE_SIZE + spacing, Constants.TILE_SIZE + spacing);
    }
}
