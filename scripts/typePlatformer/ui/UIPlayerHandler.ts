import { UIComponent } from "../components/ui/UIComponent";
import { Player } from "../entity/player/Player";

export class UIPlayerHandler {

    private healhBar: UIComponent[] = [];
    private player: Player;

    constructor(player: Player) {
        this.player = player;

        this.healhBar.push(new UIComponent({x: 1, y: 1, width: 140, height: 18}, {red: 128,green:  128,blue: 128, alpha: 0.5}, false))
        this.healhBar.push(new UIComponent({x: 6, y: 3, width: 130, height: 14}, {red: 200,green:  50,blue: 50, alpha: 1.0}, false))
    }

    public render(ctx: CanvasRenderingContext2D) {
        for(let i = 0; i < this.healhBar.length; i++) {
            this.healhBar[i].render(ctx);
        }
    }

    public update() {
        this.healhBar[1].setHitbox({...this.healhBar[1].getHitbox(), width: Math.max(this.player.getHealthComponent().getHealth()/this.player.getHealthComponent().getMaxHealth() * 130, 0)})
    }
}