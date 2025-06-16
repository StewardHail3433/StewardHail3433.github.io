import { Camera } from "../camera/Camera";
import { UIComponent } from "../components/ui/UIComponent";
import { UIComponentButton } from "../components/ui/UIComponentButton";
import { UIComponentLabel } from "../components/ui/UIComponentLabel";
import { Player } from "../entity/player/Player";
import { Constants } from "../utils/Constants";

export class UIDebugHandler {

    private debugComponent: UIComponent;
    private camera: Camera;
    private player: Player;
    private debugInfo: UIComponent;
    private debugTeleportToCenterButton: UIComponent;
    private debugZoomIn: UIComponent;
    private debugZoomOut: UIComponent;
    private debugSpeedUp: UIComponentButton;
    private debugSpeedDown: UIComponentButton;

    constructor(canvas: HTMLCanvasElement, debugComponent: UIComponent, player: Player, camera: Camera) {
        this.debugComponent = debugComponent;
        this.camera = camera;
        this.player = player;

        this.debugInfo = new UIComponentLabel({
            x: 5, y: 5, width: this.debugComponent.getHitbox().width - 10, height: 80
        }, {red: 0, green: 255, blue: 0}, true, "Boo", {red: 0, green: 0, blue: 255}, 9);
        this.debugTeleportToCenterButton = new UIComponentButton(canvas, {
            x: 5, y: 90, width: this.debugComponent.getHitbox().width - 10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Teleport Center", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {});

        this.debugZoomIn = new UIComponentButton(canvas, {
            x: 5, y: 120, width: (this.debugComponent.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Zoom In", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.camera.setView({...this.camera.getView(), zoom: this.camera.getView().zoom + 0.25})
        });

        this.debugZoomOut = new UIComponentButton(canvas, {
            x: 5 + (this.debugComponent.getHitbox().width - 10)/2 + 10, y: 120, width: (this.debugComponent.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Zoom Out", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.camera.setView({...this.camera.getView(), zoom: Math.max(this.camera.getView().zoom - 0.25, 0.25)})
        });

        this.debugSpeedUp = new UIComponentButton(canvas, {
            x: 5, y: 150, width: (this.debugComponent.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Increase Speed", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.player.setSpeed(this.player.getSpeed() + 15);
        });

        this.debugSpeedDown = new UIComponentButton(canvas, {
            x: 5 + (this.debugComponent.getHitbox().width - 10)/2 + 10, y: 150, width: (this.debugComponent.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Decrease Speed", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.player.setSpeed(this.player.getSpeed() - 15);
        });

        this.debugComponent.hide();
        this.debugSpeedUp.setParentComponent(this.debugComponent);
        this.debugSpeedDown.setParentComponent(this.debugComponent);
        this.debugZoomIn.setParentComponent(this.debugComponent);
        this.debugZoomOut.setParentComponent(this.debugComponent);
        this.debugInfo.setParentComponent(this.debugComponent);
        this.debugTeleportToCenterButton.setParentComponent(this.debugComponent);
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.debugComponent.render(ctx);
        this.debugInfo.render(ctx);
        this.debugTeleportToCenterButton.render(ctx);
        this.debugZoomIn.render(ctx);
        this.debugZoomOut.render(ctx);
        this.debugSpeedUp.render(ctx);
        this.debugSpeedDown.render(ctx);
    }

    public update() {
        if(Constants.INPUT_HANDLER.checkControlToggle(this.player.getControls().debug)) {
            this.show()
        } else {
            this.hide();
            return;
        }
        (this.debugInfo as UIComponentLabel).update("Player coord: (" + (this.player.getHitboxComponent().getHitbox().x)?.toFixed(0) + ", " + (this.player?.getHitboxComponent().getHitbox().y)?.toFixed(0) + ")\nPlayer Direction: " + this.player.getDirection() + "\nPlayer Health: " + this.player.getHealthComponent().getHealth() + "\nCamera zoom" + this.camera.getView().zoom + "\nPlayer speed: " + this.player.getSpeed() + "\nPlayer Layer: " + this.player.getLayer());
        (this.debugTeleportToCenterButton as UIComponentButton).setOnTrue(() => {
            this.player.getHitboxComponent().setHitbox({
                ...this.player.getHitboxComponent().getHitbox(),
                x: 480/2,
                y: 320/2
            })
        });
        (this.debugTeleportToCenterButton as UIComponentButton).update();
        (this.debugZoomIn as UIComponentButton).update();
        (this.debugZoomOut as UIComponentButton).update();
        this.debugSpeedUp.update();
        this.debugSpeedDown.update();
    }

    public hide() {
        this.debugComponent.hide();
        this.debugInfo.hide();
        this.debugTeleportToCenterButton.hide();
        this.debugZoomIn.hide();
        this.debugZoomOut.hide();
        this.debugSpeedUp.hide();
        this.debugSpeedDown.hide();
    }

    public show() {
        this.debugComponent.show();
        this.debugInfo.show();
        this.debugTeleportToCenterButton.show();
        this.debugZoomIn.show();
        this.debugZoomOut.show();
        this.debugSpeedUp.show();
        this.debugSpeedDown.show();
    }
}