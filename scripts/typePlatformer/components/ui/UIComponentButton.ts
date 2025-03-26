import { UIComponent } from "./UIComponent.js";
import { UIComponentLabel } from "./UIComponentLabel.js";

export class UIComponentButton extends UIComponentLabel {

    protected hoverColor: {red: number; green: number; blue: number; alpha?: number};
    protected hoverTextColor: {red: number; green: number; blue: number; alpha?: number};
    private click: boolean;
    private action?: () => void;
    private defaultColor: {red: number; green: number; blue: number; alpha?: number};
    private clickColor: {red: number; green: number; blue: number; alpha?: number};
    private canvas : HTMLCanvasElement;
    private shouldAction: boolean;
    constructor(
        canvas: HTMLCanvasElement,
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        text: string = "", 
        textColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        fontSize: number = 8,
        hoverColor: {red: number; green: number; blue: number; alpha?: number} = color, 
        hoverTextColor: {red: number; green: number; blue: number; alpha?: number} = textColor,
        clickColor: {red: number; green: number; blue: number; alpha?: number} = color,
        action?: () => void
    ) {
        super(hitbox, color, hidden, text, textColor, fontSize);
        this.hoverColor = hoverColor;
        this.hoverTextColor = hoverTextColor;
        this.click = false;
        this.defaultColor = color;
        this.clickColor = clickColor;
        this.action = action;
        this.canvas = canvas;
        this.shouldAction = false;
        
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
    }

    private handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if(x>this.hitbox.x && x < this.hitbox.x +this.hitbox.width
            && y>this.hitbox.y && y < this.hitbox.y +this.hitbox.height) {
                if(!this.click) {
                    this.shouldAction = true;
                }
                this.click = true;
                this.color = this.clickColor
            }
    }
    private handleMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if(x>this.hitbox.x && x < this.hitbox.x +this.hitbox.width
            && y>this.hitbox.y && y < this.hitbox.y +this.hitbox.height) {
                this.color = this.hoverColor;
            } else {
                this.color = this.defaultColor;
            }
    }

    private handleMouseUp(event: MouseEvent) {
        if(this.click) {
            this.color = this.defaultColor;
            this.click = false;
            this.shouldAction = false;
        }
    }


    public update(text: string = this.text) {
        super.update(text);
        if(this.click && this.shouldAction) {
            if(this.action) {
                this.action();
                this.shouldAction = false;
            }
        }
    }

    public setAction(action: () => void) {
        this.action = action;
    }
    
}