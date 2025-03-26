import { UIComponent } from "../components/ui/UIComponent.js";
import { UIComponentButton } from "../components/ui/UIComponentButton.js";
import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { Player } from "../entity/player/Player.js";

export class UIHandler {
    private debug: UIComponent;
    private debugInfo: UIComponent;
    private debugTeleportToCenterButton: UIComponent;
    private keys: { [key: string]: boolean } = {};
    private keysToggled: { [key: string]: boolean } = {"F3": false};
    private playermovement?: UIComponent[];
    constructor(canvas: HTMLCanvasElement, player: Player) {
        this.debug = new UIComponent({
            x: 0, y: 0, width: canvas.width / 5, height: canvas.height
        }, {red: 255, green: 0, blue: 0, alpha: 0.5}, true);
        this.debugInfo = new UIComponentLabel({
            x: 5, y: 5, width: this.debug.getHitbox().width - 10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Boo", {red: 0, green: 0, blue: 255}, 9);
        this.debugTeleportToCenterButton = new UIComponentButton(canvas, {
            x: 5, y: 30, width: this.debug.getHitbox().width - 10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Teleport Center", {red: 0, green: 0, blue: 255}, 9, {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {});
        this.debug.hide();
        this.debugInfo.hide();
        this.debugTeleportToCenterButton.hide();

        this.playermovement = player.getMovementButton(canvas);
        player.setToKeyboard();

        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    public render(ctx: CanvasRenderingContext2D, player: Player) {
        this.debug.render(ctx);
        this.debugInfo.render(ctx, this.debug)
        this.debugTeleportToCenterButton.render(ctx, this.debug);
        if(player?.getTouchMode()) {
            for(var button of this.playermovement) {
                button.update();
            }
        }
    }

    public update(player?: Player) {
        (this.debugInfo as UIComponentLabel).update("Player coord: (" + (player?.getHitboxComponent().getHitbox().x)?.toFixed(0) + ", " + (player?.getHitboxComponent().getHitbox().y)?.toFixed(0) + ")");
        (this.debugTeleportToCenterButton as UIComponentButton).setOnTrue(() => {
            player?.getHitboxComponent().setHitbox({
                ...player.getHitboxComponent().getHitbox(),
                x: 480/2,
                y: 320/2
            })
        });
        (this.debugTeleportToCenterButton as UIComponentButton).update();
        if(this.keysToggled["F3"]) {
            this.debug.show();
            this.debugInfo.show();
            this.debugTeleportToCenterButton.show();
        } else {
            this.debug.hide();
            this.debugInfo.hide();
            this.debugTeleportToCenterButton.hide();
        }
        if(this.keysToggled["t"]) {
            player?.setToTouch();
        } else {
            player?.setToKeyboard();
        }

        if(player?.getTouchMode()) {
            for(var button of this.playermovement) {
                button.update();
            }
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        if (!(event.key in this.keysToggled)) {
            this.keysToggled[event.key] = false; 
        }
        if (!this.keys[event.key]) {
            this.keysToggled[event.key] = !this.keysToggled[event.key];
        }
        this.keys[event.key] = true;
    }

    private handleKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        this.keys[event.key] = false;
    }

}
