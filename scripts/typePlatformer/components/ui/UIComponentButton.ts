import { UIComponent } from "./UIComponent.js";
import { UIComponentLabel } from "./UIComponentLabel.js";

export class UIComponentButton extends UIComponentLabel {

    protected hoverColor: {red: number; green: number; blue: number; alpha?: number};
    protected hoverTextColor: {red: number; green: number; blue: number; alpha?: number};
    private click: boolean;
    private onTrue?: () => void;
    private onFalse?: () => void; 
    private whileTrue?: () => void;
    private whileFalse?: () => void; // TODO
    private defaultColor: {red: number; green: number; blue: number; alpha?: number};
    private clickColor: {red: number; green: number; blue: number; alpha?: number};
    private canvas : HTMLCanvasElement;
    private shouldOnTrue: boolean;
    private shouldOnFalse: boolean;
    private activeTouches: Set<number> = new Set();
    constructor(
        canvas: HTMLCanvasElement,
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        text: string = "", 
        textColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        fontSize: number = 8,
        textAlign: CanvasTextAlign = "left",
        hoverColor: {red: number; green: number; blue: number; alpha?: number} = color, 
        hoverTextColor: {red: number; green: number; blue: number; alpha?: number} = textColor,
        clickColor: {red: number; green: number; blue: number; alpha?: number} = color,
        onTrue?: () => void,
        onFalse?: () => void,
        whileTrue?: () => void,
        whileFalse?: () => void,
    ) {
        super(hitbox, color, hidden, text, textColor, fontSize, textAlign);
        this.hoverColor = hoverColor;
        this.hoverTextColor = hoverTextColor;
        this.click = false;
        this.defaultColor = color;
        this.clickColor = clickColor;
        this.onTrue = onTrue;
        this.onFalse = onFalse;
        this.whileTrue = whileTrue;
        this.whileFalse = whileFalse;
        this.canvas = canvas;
        this.shouldOnTrue = false;
        this.shouldOnFalse = true
        
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
        document.addEventListener("touchstart", (event) => this.handleTouchStart(event));
        document.addEventListener("touchmove", (event) => this.handleTouchMove(event));
        document.addEventListener("touchend", (event) => this.handleTouchEnd(event));
    }

    private handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect(); 
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if(x>this.hitbox.x && x < this.hitbox.x +this.hitbox.width
            && y>this.hitbox.y && y < this.hitbox.y +this.hitbox.height) {
                if(!this.click) {
                    this.shouldOnTrue = true;
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
        if(this.click && this.activeTouches.size === 0) {
            this.color = this.defaultColor;
            this.click = false;
            this.shouldOnTrue = false;
            this.shouldOnFalse = true;
        }
    }

    private handleTouchStart(event: TouchEvent) {
        var changedTouches = event.changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            const rect = this.canvas.getBoundingClientRect(); 
            let x = touch.clientX - rect.left;
            let y = touch.clientY - rect.top;
            if(x >= 0 && y >=0 && y <= 320 && x <=480) {
                event.preventDefault();
                if(x>this.hitbox.x && x < this.hitbox.x +this.hitbox.width
                    && y>this.hitbox.y && y < this.hitbox.y +this.hitbox.height) {
                        if(!this.activeTouches.size) {
                            this.shouldOnTrue = true;
                        }
                        this.click =true;
                        this.activeTouches.add(touch.identifier);
                        this.color = this.clickColor;
                    }
                }
            }
    }

    private handleTouchMove(event: TouchEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        var changedTouches = event.changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            let x = touch.clientX - rect.left;
            let y = touch.clientY - rect.top;
            if(x >= 0 && y >=0 && y <= 320 && x <=480) {
                event.preventDefault();
                if(x>this.hitbox.x && x < this.hitbox.x +this.hitbox.width
                    && y>this.hitbox.y && y < this.hitbox.y +this.hitbox.height) {
                        this.color = this.hoverColor;
                    } else {
                        this.color = this.defaultColor;
                    }
                }
            }
    }

    private handleTouchEnd(event: TouchEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        var changedTouches = event.changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
            let touch = changedTouches[i];
            let x = touch.clientX - rect.left;
            let y = touch.clientY - rect.top;
            if(x >= 0 && y >=0 && y <= 320 && x <=480) {
                event.preventDefault();
            }
            if(this.activeTouches.has(touch.identifier)) {
                this.activeTouches.delete(touch.identifier);
            }
        }
        if(this.activeTouches.size === 0) {
            this.color = this.defaultColor;
            this.click =false
            this.shouldOnTrue = false;
            this.shouldOnFalse = true;
        }
    } 

    public update(text: string = this.text) {
        super.update(text);

        this.click = this.activeTouches.size > 0 || this.click;

        if(!this.hidden) {
            if(this.click) {
                if(this.shouldOnTrue) {
                    if(this.onTrue) {
                        this.onTrue();
                        this.shouldOnTrue = false;
                    }
                }
                if(this.whileTrue) {
                    this.whileTrue();
                }
            } else {
                if(this.shouldOnFalse) {
                    if(this.onFalse) {
                        this.onFalse();
                        this.shouldOnFalse = false;
                    }
                }
                if(this.whileFalse) {
                    this.whileFalse();
                } 
            }
        }
    }

    public setOnTrue(action: () => void) {
        this.onTrue = action;
    }

    public setOnFalse(action: () => void) {
        this.onFalse = action;
    }

    public setWhileTrue(action: () => void) {
        this.whileTrue = action;
    }

    public setWhileFalse(action: () => void) {
        this.whileFalse = action;
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(this.hidden) {
            return;
        }
        super.render(ctx);
    }
    
}