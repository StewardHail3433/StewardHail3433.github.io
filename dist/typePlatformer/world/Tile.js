import { ImageLoader } from "../utils/ImageLoader.js";
import { Constants } from "../utils/Constants.js";
import { Items } from "../item/Items.js";
export class Tile {
    constructor(id, numberID, name = "TILEHE") {
        this.id = id;
        this.numberID = numberID;
        this.name = name;
        this.item = Items.registerTileItem(this);
    }
    getNumberID() {
        return this.numberID;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    render(ctx, hitboxComponent) {
        if (this.numberID === 6) {
            ctx.drawImage(ImageLoader.getImages()[2], 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
        else if (this.numberID === 7) {
            ctx.drawImage(ImageLoader.getImages()[1], 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
        else {
            let spriteSheetMapX = (this.numberID % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.numberID / 3) * Constants.TILE_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE, hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
    }
    static blockItem() {
    }
}
