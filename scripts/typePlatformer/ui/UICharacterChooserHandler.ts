import { UIComponent } from "../components/ui/UIComponent";
import { UIComponentButton } from "../components/ui/UIComponentButton";
import { UIComponentImage } from "../components/ui/UIComponentImage";
import { Player } from "../entity/player/Player";
import { Constants } from "../utils/Constants";
import { ImageLoader } from "../utils/ImageLoader";

export class UICharacterChooserHandler {

    private characterChooserComponent: UIComponent;
    private characterChooserLeftButton: UIComponentButton;
    private characterChooserRightButton: UIComponentButton;
    private characterChooserLabel: UIComponentImage;
    private characterIndex: number = 1;
    private player: Player;
    
    constructor(canvas: HTMLCanvasElement, characterChooserComponent: UIComponent, player: Player) {
        this.player = player;
        this.characterChooserComponent = characterChooserComponent;

        this.characterChooserLabel = new UIComponentImage({x: 5, y: 5, width:90, height: 90}, {red: 0, green: 255, blue: 0}, true, ImageLoader.getImages()[1], {x: 0, y: 0, width: Constants.TILE_SIZE, height: Constants.TILE_SIZE});

        this.characterChooserLeftButton = new UIComponentButton(canvas, {x: 5, y: 105, width: 25, height: 25},{red: 0, green: 255, blue: 0},true,"<=",undefined,8, "center", undefined, undefined, undefined, () => {
            let old = this.characterIndex;
            do {
                if(this.characterIndex - 1 > -1) {
                    this.characterIndex--;
                } else {
                    break;
                }
            } while(!ImageLoader.getImages()[this.characterIndex].src.includes("resources/typePlatformer/images/entity/player"));
            if(ImageLoader.getImages()[this.characterIndex].src.includes("resources/typePlatformer/images/entity/player")) {
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
            } while(!ImageLoader.getImages()[this.characterIndex].src.includes("resources/typePlatformer/images/entity/player"));
            if(ImageLoader.getImages()[this.characterIndex].src.includes("resources/typePlatformer/images/entity/player")) {
                this.characterChooserLabel.setImage(ImageLoader.getImages()[this.characterIndex]);
                this.player.setImage(ImageLoader.getImages()[this.characterIndex]);
            } else {
                this.characterIndex = old;
            }
        });

        this.initChooser();
    }

    private initChooser() {
        this.characterChooserLabel.setParentComponent(this.characterChooserComponent);
        this.characterChooserLeftButton.setParentComponent(this.characterChooserComponent);
        this.characterChooserRightButton.setParentComponent(this.characterChooserComponent);
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.characterChooserComponent.render(ctx);
        this.characterChooserLabel.render(ctx);
        this.characterChooserLeftButton.render(ctx);
        this.characterChooserRightButton.render(ctx);
    }

    public update() {
        this.characterChooserLeftButton.update();
        this.characterChooserRightButton.update();
    }

    public show() {
        this.characterChooserComponent.show();
        this.characterChooserLabel.show();
        this.characterChooserLeftButton.show();
        this.characterChooserRightButton.show();
    }

    public hide() {
        this.characterChooserComponent.hide();
        this.characterChooserLabel.hide();
        this.characterChooserLeftButton.hide();
        this.characterChooserRightButton.hide();
    }
}