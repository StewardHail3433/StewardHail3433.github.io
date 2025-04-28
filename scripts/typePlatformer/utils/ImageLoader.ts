export class ImageLoader {
    private static images: HTMLImageElement[] = [
        this.createImage("resources/typePlatformer/images/tiles/fields.png"),
        this.createImage("resources/typePlatformer/images/tiles/tree_leaves.png"),
        this.createImage("resources/typePlatformer/images/tiles/tree_stump.png"),
        this.createImage("resources/typePlatformer/images/entity/player/playerSheet.png"),
        this.createImage("resources/typePlatformer/images/entity/player/playerSheet3.png"),
        this.createImage("resources/typePlatformer/images/items/stick.png"),
        this.createImage("resources/typePlatformer/images/items/sword.png"),
        this.createImage("resources/typePlatformer/images/items/pickaxe.png"),
        this.createImage("resources/typePlatformer/images/entity/player/playerSheet2.png"),
        this.createImage("resources/typePlatformer/images/entity/player/duckMan.png"),
        this.createImage("resources/typePlatformer/images/entity/player/theVoid.png"),
        this.createImage("resources/typePlatformer/images/tiles/mouseSelction.png")];

    static getImages(): HTMLImageElement[]  {
        return this.images;
    }


    private static createImage(src: string): HTMLImageElement {
        let img = new Image()

        img.onload = () => {
            console.log("Succesfully loaded -> " + src);
        }

        img.onerror = () => {
            console.log("Failed loading -> " + src);
        }

        img.src = src;
        return img;
    }
}