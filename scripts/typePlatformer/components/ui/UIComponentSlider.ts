import { isInside } from "../../utils/Collisions";
import { Constants } from "../../utils/Constants";
import { UIComponent } from "./UIComponent";
import { UIComponentLabel } from "./UIComponentLabel";

export class UIComponentSlider extends UIComponent {

    private knobColor: {red: number, green: number, blue: number, alpha?: number};
    private value: number;
    private knobHitbox: {x: number; y: number; width: number; height: number};
    private onChange: (value: number) => void;

    constructor(
        hitbox: {x: number; y: number; width: number; height: number},
        color: {red: number; green: number; blue: number; alpha?: number} = { red: 255, green: 0, blue: 255, alpha: 1.0}, 
        hidden: boolean, 
        knobColor: {red: number; green: number; blue: number; alpha?: number} = { red: 0, green: 0, blue: 0, alpha: 1.0 }, 
        initialValue: number,
        onChange = (value: number) => {}
    ) {
        super(hitbox,color,hidden);
        this.knobColor = knobColor;
        this.value = initialValue;
        this.knobHitbox = {x: (this.value * this.hitbox.width + this.hitbox.x) - 10/2, y: hitbox.y - 4, width: 10, height: hitbox.height + 8}
        this.onChange = onChange;
        this.onChange(this.value);
    }

    private mouseDown() {
        const mousePos = Constants.INPUT_HANDLER.getMousePosition();
        var boxx: number = this.hitbox.x; 
        var boxy: number = this.hitbox.y;
        if(this.parentComponent && !this.parentComponent.isHidden()) {
            const parentComponentHitbox = this.parentComponent.getHitbox();
            boxx += parentComponentHitbox.x;
            boxy += parentComponentHitbox.y;
        }
        if(isInside(mousePos, {...this.hitbox, x:boxx-2, y:boxy, width: this.hitbox.width+4})) {
            let value = (mousePos.x - boxx) / this.hitbox.width;
            value = Math.max(0, Math.min(1, value));
            if(this.value != value) {
                this.value = value
                this.onChange(this.value);
            }
            this.knobHitbox.x = boxx + this.value * this.hitbox.width - this.knobHitbox.width / 2;
        }
    }

    public update(text?: string): void {
        if(Constants.INPUT_HANDLER.isLeftDown()) {
            this.mouseDown();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if(this.hidden) {
            return;
        }
        super.render(ctx);
        if(this.knobColor.alpha) {
            ctx.fillStyle = "rgba(" + this.knobColor.red + "," + this.knobColor.green + "," + this.knobColor.blue + ", " + this.knobColor.alpha + ")";
        } else {
            ctx.fillStyle = "rgb(" + this.knobColor.red + "," + this.knobColor.green + "," + this.knobColor.blue + ")";
        }
        let khb = this.knobHitbox;
        if(this.parentComponent) {
            ctx.fillRect(this.knobHitbox.x, this.knobHitbox.y +this.parentComponent.getHitbox().y, this.knobHitbox.width, this.knobHitbox.height)
        } else {
            ctx.fillRect(this.knobHitbox.x , this.knobHitbox.y, this.knobHitbox.width, this.knobHitbox.height)
        }
    }

    public getValue(): number {
        console.log(this.value);
        return this.value;
    }

}
