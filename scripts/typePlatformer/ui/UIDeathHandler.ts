import { UIComponent } from "../components/ui/UIComponent";
import { UIComponentButton } from "../components/ui/UIComponentButton";
import { UIComponentLabel } from "../components/ui/UIComponentLabel";
import { Player } from "../entity/player/Player";

export class UIDeathHandler {

    private deathComponent: UIComponent;
    private deathMenuComponents: UIComponent[] = [];
    private healhBar: UIComponent[] = [];
    private player: Player;

    constructor(canvas: HTMLCanvasElement, deathComponent: UIComponent, player: Player) {
        this.deathComponent = deathComponent;
        this.player = player;

        this.initMenu(canvas)
        this.healhBar.push(new UIComponent({x: 1, y: 1, width: 140, height: 18}, {red: 128,green:  128,blue: 128, alpha: 0.5}, false))
        this.healhBar.push(new UIComponent({x: 6, y: 3, width: 130, height: 14}, {red: 200,green:  50,blue: 50, alpha: 1.0}, false))
    
    }

    private initMenu(canvas: HTMLCanvasElement) {
        const buttonWidth = 120;
        const buttonHeight = 40;

        const color = { red: 150, green: 150, blue: 150, alpha: 1 };
        const hoverColor = { red: 100, green: 100, blue: 100, alpha: 1 };
        const clickColor = { red: 200, green: 200, blue: 200, alpha: 1 };

        this.deathMenuComponents.push(
            new UIComponentLabel({x: this.deathComponent.getHitbox().width/2 - canvas.getContext("2d")!.measureText("YOu DIED").width/2, y:this.deathComponent.getHitbox().height/2 - this.deathComponent.getHitbox().height/5, width: canvas.getContext("2d")!.measureText("YOu DIED").width,height:32}, {red:0, blue:0, green:0, alpha: 0.001},true, "YOU DIED", {red:255,blue:255,green:255, alpha:1.0}, 8, "center", false)
        )
        this.deathMenuComponents.push(
            new UIComponentButton(canvas, {x: this.deathComponent.getHitbox().width/2 - buttonWidth/2, y:this.deathComponent.getHitbox().height/2 + this.deathComponent.getHitbox().height/5, width: buttonWidth, height:buttonHeight}, color ,true, "RESPAWN", {red:255,blue:255,green:255, alpha:1.0}, 8, "center", hoverColor, {red:255,blue:255,green:255, alpha:1.0}, clickColor,  () => {this.player.getHitboxComponent().setHitbox({...this.player.getHitboxComponent().getHitbox(), x: 100, y:100}); this.player.getHealthComponent().heal(this.player.getHealthComponent().getMaxHealth())})
        )
        this.deathMenuComponents[0].setParentComponent(this.deathComponent);
        this.deathMenuComponents[1].setParentComponent(this.deathComponent);

    }

    public renderHealth(ctx: CanvasRenderingContext2D) {
        for(let i = 0; i < this.healhBar.length; i++) {
            this.healhBar[i].render(ctx);
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.deathComponent.render(ctx);
        for(let i = 0; i < this.deathMenuComponents.length; i++) {
            this.deathMenuComponents[i].render(ctx);
        }
    }

    public update() {
        
        for(let i = 0; i < this.deathMenuComponents.length; i++) {
            this.deathMenuComponents[i].update();
        }
    }
    public updateHealth() {
        this.healhBar[1].setHitbox({...this.healhBar[1].getHitbox(), width: (this.player.getHealthComponent().getHealth()/this.player.getHealthComponent().getMaxHealth() <= 0? 0 : this.player.getHealthComponent().getHealth()/this.player.getHealthComponent().getMaxHealth()) * 130})
    }

    public hide() {
        this.deathComponent.hide();
        for(let i = 0; i < this.deathMenuComponents.length; i++) {
            this.deathMenuComponents[i].hide();
        }
    }

    public show() {
        this.deathComponent.show();
        for(let i = 0; i < this.deathMenuComponents.length; i++) {
            this.deathMenuComponents[i].show();
        }
    }
}