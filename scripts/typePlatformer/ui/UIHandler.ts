import { Camera } from "../camera/Camera.js";
import { UIComponent } from "../components/ui/UIComponent.js";
import { UIComponentButton } from "../components/ui/UIComponentButton.js";
import { UIComponentImage } from "../components/ui/UIComponentImage.js";
import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { Player } from "../entity/player/Player.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { WorldHandler } from "../world/WorldHandler.js";
import { UIChatHandler } from "./UIChatHandler.js";
import { UIDeathHandler } from "./UIDeathHandler.js";
import { UIPauseHandler } from "./UIPauseHandler.js";

export class UIHandler {
    private debug: UIComponent;
    private debugInfo: UIComponent;
    private debugTeleportToCenterButton: UIComponent;
    private debugZoomIn: UIComponent;
    private debugZoomOut: UIComponent;
    private debugSpeedUp: UIComponentButton;
    private debugSpeedDown: UIComponentButton;
    private uiChatHandler: UIChatHandler;
    private playermovement?: UIComponent[];
    private uiPauseHandler: UIPauseHandler;
    private uiDeathHandler: UIDeathHandler;
    private player: Player;
    private camera: Camera;
    private characterChooserComponent: UIComponent;
    private characterChooserLeftButton: UIComponentButton;
    private characterChooserRightButton: UIComponentButton;
    private characterChooserLabel: UIComponentImage;
    private characterIndex: number = 1;

    constructor(canvas: HTMLCanvasElement, player: Player, camera: Camera, worldH: WorldHandler) {
        this.debug = new UIComponent({
            x: 0, y: 0, width: Constants.CANVAS_WIDTH / 5, height: Constants.CANVAS_HEIGHT
        }, {red: 255, green: 0, blue: 0, alpha: 0.5}, true);
        this.debugInfo = new UIComponentLabel({
            x: 5, y: 5, width: this.debug.getHitbox().width - 10, height: 80
        }, {red: 0, green: 255, blue: 0}, true, "Boo", {red: 0, green: 0, blue: 255}, 9);
        this.debugTeleportToCenterButton = new UIComponentButton(canvas, {
            x: 5, y: 90, width: this.debug.getHitbox().width - 10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Teleport Center", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {});
        this.camera = camera;
        this.debugZoomIn = new UIComponentButton(canvas, {
            x: 5, y: 120, width: (this.debug.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Zoom In", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.camera.setView({...this.camera.getView(), zoom: this.camera.getView().zoom + 0.25})
        });

        this.debugZoomOut = new UIComponentButton(canvas, {
            x: 5 + (this.debug.getHitbox().width - 10)/2 + 10, y: 120, width: (this.debug.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Zoom Out", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.camera.setView({...this.camera.getView(), zoom: Math.max(this.camera.getView().zoom - 0.25, 0.25)})
        });

        this.debugSpeedUp = new UIComponentButton(canvas, {
            x: 5, y: 150, width: (this.debug.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Increase Speed", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.player.setSpeed(this.player.getSpeed() + 15);
        });

        this.debugSpeedDown = new UIComponentButton(canvas, {
            x: 5 + (this.debug.getHitbox().width - 10)/2 + 10, y: 150, width: (this.debug.getHitbox().width - 10)/2 -10, height: 20
        }, {red: 0, green: 255, blue: 0}, true, "Decrease Speed", {red: 0, green: 0, blue: 255}, 9, "center", {red: 123, green: 123, blue: 0},undefined, {red: 255, green: 0, blue: 255}, () => {
            this.player.setSpeed(this.player.getSpeed() - 15);
        });

        this.uiChatHandler = new UIChatHandler(canvas, new UIComponent({
            x: Constants.CANVAS_WIDTH - Constants.CANVAS_WIDTH / 5, y: 0, width: Constants.CANVAS_WIDTH / 5, height: Constants.CANVAS_HEIGHT / 2
        }, {red: 255, green: 0, blue: 0, alpha: 0.5}, false));

       this.characterChooserComponent = new UIComponent(
        {x: Constants.CANVAS_WIDTH/2-50, y: Constants.CANVAS_HEIGHT/2-55, width:100, height:135}, {red: 255, green: 0, blue: 0, alpha: 0.5}, true
       );

        this.debug.hide();
        this.debugInfo.hide();
        this.debugTeleportToCenterButton.hide();
        this.debugSpeedUp.setParentComponent(this.debug);
        this.debugSpeedDown.setParentComponent(this.debug);
        this.debugZoomIn.setParentComponent(this.debug);
        this.debugZoomOut.setParentComponent(this.debug);
        this.debugInfo.setParentComponent(this.debug);
        this.debugTeleportToCenterButton.setParentComponent(this.debug);
        this.player = player;

        this.characterChooserLabel = new UIComponentImage({x: 5, y: 5, width:90, height: 90}, {red: 0, green: 255, blue: 0}, true, ImageLoader.getImages()[1], {x: 0, y: 0, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE});

        this.characterChooserLeftButton = new UIComponentButton(canvas, {x: 5, y: 105, width: 25, height: 25},{red: 0, green: 255, blue: 0},true,"<=",undefined,8, "center", undefined, undefined, undefined, () => {
            let old = this.characterIndex;
            do {
                if(this.characterIndex - 1 > -1) {
                    this.characterIndex--;
                } else {
                    break;
                }
            } while(!ImageLoader.getImages()[this.characterIndex].src.includes("images/entity/player"));
            if(ImageLoader.getImages()[this.characterIndex].src.includes("images/entity/player")) {
                this.characterChooserLabel.setImage(ImageLoader.getImages()[this.characterIndex]);
                this.player.setImage(ImageLoader.getImages()[this.characterIndex]);
            } else {
                this.characterIndex = old;
            }
        });

        this.characterChooserRightButton = new UIComponentButton(canvas, {x: 70, y: 105, width: 25, height: 25},{red: 0, green: 255, blue: 0},true,"=>",undefined,8, "center", undefined, undefined, undefined, () => {
            let old = this.characterIndex;
            do {
                if(this.characterIndex + 1 < ImageLoader.getImages().length) {
                    this.characterIndex++;
                } else {
                    break;
                }
            } while(!ImageLoader.getImages()[this.characterIndex].src.includes("images/entity/player"));
            if(ImageLoader.getImages()[this.characterIndex].src.includes("images/entity/player")) {
                this.characterChooserLabel.setImage(ImageLoader.getImages()[this.characterIndex]);
                this.player.setImage(ImageLoader.getImages()[this.characterIndex]);
            } else {
                this.characterIndex = old;
            }
        })

        this.characterChooserLabel.setParentComponent(this.characterChooserComponent);
        this.characterChooserLeftButton.setParentComponent(this.characterChooserComponent);
        this.characterChooserRightButton.setParentComponent(this.characterChooserComponent);

        Constants.COMMAND_SYSTEM.addCommand("debug", (args) => {
                Constants.INPUT_HANDLER.setToggle("F3", !Constants.INPUT_HANDLER.getKeyToggled()["F3"]);
        });

        this.uiPauseHandler = new UIPauseHandler(canvas, new UIComponent({x:20,y:20,width:Constants.CANVAS_WIDTH - 40, height:Constants.CANVAS_HEIGHT - 40}, { red: 100, green: 100, blue: 100, alpha: 0.5 },false))

        this.uiDeathHandler = new UIDeathHandler(canvas, new UIComponent({x:20,y:20,width:Constants.CANVAS_WIDTH - 40, height:Constants.CANVAS_HEIGHT - 40}, { red: 100, green: 100, blue: 100, alpha: 0.5 },false), player);
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.debug.render(ctx);
        this.debugInfo.render(ctx);
        this.debugTeleportToCenterButton.render(ctx);
        this.debugZoomIn.render(ctx);
        this.debugZoomOut.render(ctx);
        this.debugSpeedUp.render(ctx);
        this.debugSpeedDown.render(ctx);
        this.uiChatHandler.render(ctx);
        this.characterChooserComponent.render(ctx);
        this.characterChooserLabel.render(ctx);
        this.characterChooserLeftButton.render(ctx);
        this.characterChooserRightButton.render(ctx);
        this.uiDeathHandler.renderHealth(ctx);

        this.uiPauseHandler.render(ctx);
        this.uiDeathHandler.render(ctx);
        
    }

    public update() {
        this.uiChatHandler.update();
        if(!this.player.getHealthComponent().isDead()) {
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
            this.characterChooserLeftButton.update();
            this.characterChooserRightButton.update();
            if(Constants.INPUT_HANDLER.getKeyToggled()["F3"]) {
                this.debug.show();
                this.debugInfo.show();
                this.debugTeleportToCenterButton.show();
                this.debugZoomIn.show();
                this.debugZoomOut.show();
                this.debugSpeedUp.show();
                this.debugSpeedDown.show();
            } else {
                this.debug.hide();
                this.debugInfo.hide();
                this.debugTeleportToCenterButton.hide();
                this.debugZoomIn.hide();
                this.debugZoomOut.hide();
                this.debugSpeedUp.hide();
                this.debugSpeedDown.hide();
            }
            if(Constants.INPUT_HANDLER.getKeyToggled()["/"]) { 
                this.uiChatHandler.hide()
            } else {
                this.uiChatHandler.show()
            }

            if(Constants.INPUT_HANDLER.getKeyToggled()["m"]) {
                this.characterChooserComponent.show();
                this.characterChooserLabel.show();
                this.characterChooserLeftButton.show();
                this.characterChooserRightButton.show();
            } else {
                this.characterChooserComponent.hide();
                this.characterChooserLabel.hide();
                this.characterChooserLeftButton.hide();
                this.characterChooserRightButton.hide();
            }
            this.uiPauseHandler.update();
            this.uiDeathHandler.hide();
            this.uiDeathHandler.updateHealth();
        } else {
            this.uiDeathHandler.show();
            this.uiDeathHandler.update();
            // this.uiChatHandler.hide()
            this.debug.hide();
            this.debugInfo.hide();
            this.debugTeleportToCenterButton.hide();
            this.debugZoomIn.hide();
            this.debugZoomOut.hide();
            this.debugSpeedUp.hide();
            this.debugSpeedDown.hide();
            this.uiPauseHandler.setPauseScreen("none")
        }    
    }

    public getChatHandler(): UIChatHandler {
        return this.uiChatHandler;
    }

}
