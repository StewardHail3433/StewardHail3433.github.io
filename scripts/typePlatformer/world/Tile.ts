import { ImageLoader } from "../utils/ImageLoader.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";

export class Tile {
    private id: string;
    private numberID: number;

    constructor(
        id:string,
        numberID:number
    ) {
        this.id = id;
        this.numberID = numberID;
    }

    public getNumberID(): number {
        return this.numberID;
    }

    public getId(): number {
        return this.numberID;
    }

    public render(ctx: CanvasRenderingContext2D, hitboxComponent: HitboxComponent) {
        if(this.numberID === 6) {
            ctx.drawImage(ImageLoader.getImages()[2], 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE,  hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        } else if(this.numberID === 7) {
            ctx.drawImage(ImageLoader.getImages()[1], 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE,  hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        } else {
            let spriteSheetMapX = (this.numberID % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.numberID / 3) * Constants.TILE_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE,  hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);

        }    
    }
}
