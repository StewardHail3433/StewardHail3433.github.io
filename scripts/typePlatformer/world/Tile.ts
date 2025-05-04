import { ImageLoader } from "../utils/ImageLoader.js";
import { HitboxComponent } from "../components/HitboxComponent.js";
import { Constants } from "../utils/Constants.js";
import { Item } from "../item/Item.js";
import { Items } from "../item/Items.js";

export class Tile {
    private id: string;
    private numberID: number;
    private name: string;
    private item: Item;
    private img: HTMLImageElement | undefined;
    private settings: {breakTime: number} 

    constructor(
        id:string,
        numberID:number,
        name: string = "TILEHE",
        settings: {breakTime: number} = {breakTime: 50}
    ) {
        this.id = id;
        this.numberID = numberID;
        this.name = name;
        this.item = Items.registerTileItem(this);
        this.settings = settings;
        if(this.numberID > 5) {
            let src = "resources/typePlatformer/images/tiles/" + this.id + ".png";
            ImageLoader.getImages().forEach(img => {
                if(img.src.substring(img.src.match("resources")?.index!) === src) {
                    this.img = img;
                }
            })
        }

    }

    public getItem() {
        return this.item;
    }

    public getNumberID(): number {
        return this.numberID;
    }

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public render(ctx: CanvasRenderingContext2D, hitboxComponent: HitboxComponent) {
        const hitbox = hitboxComponent.getHitbox();
        if(this.numberID <= 5) {
            let spriteSheetMapX = (this.numberID % 3) * Constants.TILE_SIZE;
            let spriteSheetMapY = Math.floor(this.numberID / 3) * Constants.TILE_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(ImageLoader.getImages()[0], spriteSheetMapX, spriteSheetMapY, Constants.TILE_SIZE, Constants.TILE_SIZE,  hitbox.x, hitbox.y, Constants.TILE_SIZE, Constants.TILE_SIZE);
        } else {
            if(this.img) {
                ctx.drawImage(this.img!, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE,  hitbox.x, hitbox.y, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else {
                    ctx.fillStyle = "#FF13F0";
                    ctx.fillRect(hitbox.x, hitbox.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                    ctx.fillRect(hitbox.x+Constants.TILE_SIZE/2, hitbox.y +Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                    ctx.fillStyle = "rgb(0,0,0)";
                    ctx.fillRect(hitbox.x, hitbox.y+Constants.TILE_SIZE/2, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
                    ctx.fillRect(hitbox.x+Constants.TILE_SIZE/2, hitbox.y, Constants.TILE_SIZE/2, Constants.TILE_SIZE/2);
            }
        }    
    }

    public getSettings() {
        return this.settings;
    }

    public getImage() {
        return this.img;
    }
}
