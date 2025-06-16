import { Camera } from "../camera/Camera.js";
import { UIComponent } from "../components/ui/UIComponent.js";
import { UIComponentButton } from "../components/ui/UIComponentButton.js";
import { UIComponentImage } from "../components/ui/UIComponentImage.js";
import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { Player } from "../entity/player/Player.js";
import { Constants } from "../utils/Constants.js";
import { ImageLoader } from "../utils/ImageLoader.js";
import { WorldHandler } from "../world/WorldHandler.js";
import { UICharacterChooserHandler } from "./UICharacterChooserHandler.js";
import { UIChatHandler } from "./UIChatHandler.js";
import { UIDeathHandler } from "./UIDeathHandler.js";
import { UIDebugHandler } from "./UIDebugHandler.js";
import { UIPauseHandler } from "./UIPauseHandler.js";
import { UIPlayerHandler } from "./UIPlayerHandler.js";

export class UIHandler {
    private uiDebugHandler: UIDebugHandler;
    private uiChatHandler: UIChatHandler;
    private uiPauseHandler: UIPauseHandler;
    private uiDeathHandler: UIDeathHandler;
    private uiPlayerHandler: UIPlayerHandler;
    private uiCharacterChooserHandler: UICharacterChooserHandler;
    private player: Player;
    private camera: Camera;

    constructor(canvas: HTMLCanvasElement, player: Player, camera: Camera, worldH: WorldHandler) {
        this.player = player;
        this.camera = camera;
        this.uiDebugHandler = new UIDebugHandler(canvas, new UIComponent({
            x: 0, y: 0, width: Constants.CANVAS_WIDTH / 5, height: Constants.CANVAS_HEIGHT
        }, {red: 255, green: 0, blue: 0, alpha: 0.5}, true) ,this.player, this.camera)

        this.uiChatHandler = new UIChatHandler(canvas, new UIComponent({
            x: Constants.CANVAS_WIDTH - Constants.CANVAS_WIDTH / 5, y: 0, width: Constants.CANVAS_WIDTH / 5, height: Constants.CANVAS_HEIGHT / 2
        }, {red: 255, green: 0, blue: 0, alpha: 0.5}, false));

        Constants.COMMAND_SYSTEM.addCommand("debug", (args) => {
                Constants.INPUT_HANDLER.setToggle(this.player.getControls().debug, !Constants.INPUT_HANDLER.getKeyToggled()[this.player.getControls().debug]);
        });

        this.uiPauseHandler = new UIPauseHandler(canvas, new UIComponent({x:20,y:20,width:Constants.CANVAS_WIDTH - 40, height:Constants.CANVAS_HEIGHT - 40}, { red: 100, green: 100, blue: 100, alpha: 0.5 },false))

        this.uiDeathHandler = new UIDeathHandler(canvas, new UIComponent({x:20,y:20,width:Constants.CANVAS_WIDTH - 40, height:Constants.CANVAS_HEIGHT - 40}, { red: 100, green: 100, blue: 100, alpha: 0.5 },false), player);
    
        this.uiPlayerHandler = new UIPlayerHandler(this.player);

        this.uiCharacterChooserHandler = new UICharacterChooserHandler(canvas, new UIComponent({x: Constants.CANVAS_WIDTH/2-50, y: Constants.CANVAS_HEIGHT/2-55, width:100, height:135}, {red: 255, green: 0, blue: 0, alpha: 0.5}, true), this.player);
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.uiDebugHandler.render(ctx);
        this.uiChatHandler.render(ctx);
        this.uiCharacterChooserHandler.render(ctx);
        this.uiPlayerHandler.render(ctx);
        this.uiPauseHandler.render(ctx);
        this.uiDeathHandler.render(ctx);
        
    }

    public update() {
        this.uiChatHandler.update();
        if(!this.player.getHealthComponent().isDead()) {
            this.uiDebugHandler.update();
            this.uiCharacterChooserHandler.update();
            if(Constants.INPUT_HANDLER.getKeyToggled()["/"]) { 
                this.uiChatHandler.hide()
            } else {
                this.uiChatHandler.show()
            }

            if(Constants.INPUT_HANDLER.getKeyToggled()["m"]) {
                this.uiCharacterChooserHandler.show();
            } else {
                this.uiCharacterChooserHandler.hide();
            }

            this.uiPauseHandler.update();
            this.uiDeathHandler.hide();
        } else {
            this.uiDeathHandler.show();
            this.uiDeathHandler.update();
            // this.uiChatHandler.hide()
            this.uiDebugHandler.hide();
            this.uiPauseHandler.setPauseScreen("none")
        }    
        this.uiPlayerHandler.update();
    }

    public getChatHandler(): UIChatHandler {
        return this.uiChatHandler;
    }

}
