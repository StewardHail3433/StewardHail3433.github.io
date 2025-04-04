var _a;
export class ImageLoader {
    static getImages() {
        return this.images;
    }
    static createImage(src) {
        let img = new Image();
        img.onload = () => {
            console.log("Succesfully loaded -> " + src);
        };
        img.onerror = () => {
            console.log("Failed loading -> " + src);
        };
        img.src = src;
        return img;
    }
}
_a = ImageLoader;
ImageLoader.images = [
    _a.createImage("resources/typePlatformer/tiles/fields.png"),
    _a.createImage("resources/typePlatformer/tiles/fields.png")
];
