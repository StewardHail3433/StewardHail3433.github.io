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
    _a.createImage("resources/typePlatformer/images/tiles/fields.png"),
    _a.createImage("resources/typePlatformer/images/tiles/tree_leaves.png"),
    _a.createImage("resources/typePlatformer/images/tiles/tree_stump.png"),
    _a.createImage("resources/typePlatformer/images/entity/player/playerSheet.png"),
    _a.createImage("resources/typePlatformer/images/entity/player/playerSheet3.png"),
    _a.createImage("resources/typePlatformer/images/items/stick.png"),
    _a.createImage("resources/typePlatformer/images/items/sword.png"),
    _a.createImage("resources/typePlatformer/images/items/pickaxe.png"),
    _a.createImage("resources/typePlatformer/images/entity/player/playerSheet2.png"),
    _a.createImage("resources/typePlatformer/images/entity/player/duckMan.png"),
    _a.createImage("resources/typePlatformer/images/entity/player/theVoid.png"),
    _a.createImage("resources/typePlatformer/images/misc/mouseSelction.png"),
    _a.createImage("resources/typePlatformer/images/misc/breaking.png"),
    _a.createImage("resources/typePlatformer/images/items/tree_leaves.png"),
    _a.createImage("resources/typePlatformer/images/items/tree_stump.png"),
    _a.createImage("resources/typePlatformer/images/items/wood.png"),
    _a.createImage("resources/typePlatformer/images/items/rock.png"),
    _a.createImage("resources/typePlatformer/images/items/grass.png"),
    _a.createImage("resources/typePlatformer/images/tiles/wood.png")
];
