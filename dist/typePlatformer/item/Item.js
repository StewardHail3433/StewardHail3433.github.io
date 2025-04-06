import { ImageLoader } from "../utils/ImageLoader.js";
export class Item {
    constructor(id, name, discription = "This is an item(I think)") {
        this.maxStackAmount = 12;
        this.id = id;
        this.name = name;
        this.discription = discription;
        let src = "resources/typePlatformer/images/items/" + this.id + ".png";
        ImageLoader.getImages().forEach(img => {
            var _a;
            if (img.src.substring((_a = img.src.match("resources")) === null || _a === void 0 ? void 0 : _a.index) === src) {
                this.img = img;
            }
        });
    }
    getImage() {
        return this.img;
    }
    getMaxStackAmount() {
        return this.maxStackAmount;
    }
    getId() {
        return this.id;
    }
}
