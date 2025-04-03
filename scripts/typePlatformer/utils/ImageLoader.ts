export class ImageLoader {
    private images: HTMLImageElement[] = [];

    public constructor() {
        this.images.push(this.createImage("resources/typePlatformer/tiles/"));
    }


    private createImage(src: string): HTMLImageElement {
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