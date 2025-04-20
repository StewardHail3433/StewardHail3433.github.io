import { Inventory } from "../../../inventory/Inventory.js";
import { isInside } from "../../../utils/Collisions.js";
import { Constants } from "../../../utils/Constants.js";
import { UIInventory } from "./UIInventory.js";

export class UIInventories {
    private inventories: UIInventory[];
    private mouseItem: {inv: Inventory,index: number, x: number, y: number, holdingItem: boolean} = {inv: new Inventory(0),index:-1,x:0,y:0,holdingItem: false};
    private canvas: HTMLCanvasElement;
    private scale: number = 1.0;

    constructor(
        canvas: HTMLCanvasElement,
    ) {
        this.canvas = canvas;
        this.inventories = [];
        document.addEventListener("mousedown", this.mouseDown.bind(this));
        document.addEventListener("mousemove", this.mouseMove.bind(this));
    }

    private mouseDown(event: MouseEvent)  {
            const rect = this.canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);// - offest
            let y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
    
            for(let i = 0; i < this.inventories.length; i++) {
                if(isInside({x, y}, {...this.inventories[i].getPlacementBox()}, this.scale) && !this.inventories[i].ishidden()) { 
                    this.inventories[i].mouseDown(event, this.mouseItem)
                    console.log("inside: ", this.inventories[i].getInventory().getSize())
                    console.log("this.mouseItem: ", this.mouseItem)
                    console.log("this.holdingItem: ", this.mouseItem.holdingItem)
                    break;
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
        }

        for(let i = 0; i < this.inventories.length; i++) {
            if(this.inventories[i].getInventory() == this.mouseItem.inv) { 
                this.inventories[i].mouseMove(event);
            }
        }
        
    }

    public addInventory(inv: UIInventory) {
        this.inventories.push(inv);
    }

    public render(ctx: CanvasRenderingContext2D) {
        for(let i = 0; i < this.inventories.length; i++) {
            this.inventories[i].render(ctx);
        }

        for(let i = 0; i < this.inventories.length; i++) {
            this.inventories[i].renderMouseItem(ctx);
        }
    }

    public update() {
        for(let i = 0; i < this.inventories.length; i++) {
            if(this.inventories[i].ishidden() && this.mouseItem.inv == this.inventories[i].getInventory() && this.mouseItem.holdingItem) {
                this.mouseItem.index = -1;
                this.mouseItem.holdingItem = false;
                this.inventories[i].update(this.mouseItem);
                break;
            }
        }
    }
    
}