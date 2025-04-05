export class ImageLoader {
    private static images: HTMLImageElement[] = [
        this.createImage("resources/typePlatformer/tiles/fields.png"),
        this.createImage("resources/typePlatformer/entity/player/playerSheet.png")];

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