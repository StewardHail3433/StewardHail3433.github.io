import { ImageLoader } from "../utils/ImageLoader.js";
import { Constants } from "../utils/Constants.js";
import { Items } from "../item/Items.js";
export class Tile {
    constructor(id, numberID, name = "TILEHE", settings = { breakTime: 50 }) {
        this.id = id;
        this.numberID = numberID;
        this.name = name;
        this.item = Items.registerTileItem(this);
        this.settings = settings;
        if (this.numberID > 5) {
            let src = "resources/typePlatformer/images/tiles/" + this.id + ".png";
            ImageLoader.getImages().forEach(img => {
                var _a;
                if (img.src.substring((_a = img.src.match("resources")) === null || _a === void 0 ? void 0 : _a.index) === src) {
                    this.img = img;
                }
            });
        }
    }
    getItem() {
        return this.item;
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
        if (this.numberID <= 5) {
            let spriteSheetMapX = (this.numberID % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.numberID / 3) * Constants.TILE_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE, hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
        else {
            if (this.img) {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
            else {
                ctx.fillStyle = "#FF13F0";
                ctx.fillRect(hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                ctx.fillRect(hitboxComponent.getHitbox().x + Constants.TILE_SIZE / 2, hitboxComponent.getHitbox().y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(hitboxComponent.getHitbox().x, hitboxComponent.getHitbox().y + Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
                ctx.fillRect(hitboxComponent.getHitbox().x + Constants.TILE_SIZE / 2, hitboxComponent.getHitbox().y, Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
            }
        }
    }
    getSettings() {
        return this.settings;
    }
}
