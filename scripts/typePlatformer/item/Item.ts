import { ImageLoader } from "../utils/ImageLoader.js";

export class Item {
    private id:string;
    private name:string;
    private discription:string;
    private maxStackAmount: number = 999;
    private isBlockItem: boolean
    private img: HTMLImageElement | undefined;
    constructor(id: string, name: string, discription:string = "This is an item(I think)", isBlockItem = false) {
        this.id = id;
        this.name = name;
        this.discription = discription;
        this.isBlockItem = isBlockItem;
        let src = "resources/typePlatformer/images/items/" + this.id + ".png";
        ImageLoader.getImages().forEach(img => {
            if(img.src.substring(img.src.match("resources")?.index!) === src) {
                this.img = img;
            }
        })
    }

    public getDiscription(): string {
        return this.discription;
    }

    public getImage(): HTMLImageElement | undefined  {
        return this.img
    }

    public getMaxStackAmount(): number {
        return this.maxStackAmount;
    }

    public getId(): string {
        return this.id;
    }

    public isABlockItem() {
        return this.isBlockItem;
    }
}