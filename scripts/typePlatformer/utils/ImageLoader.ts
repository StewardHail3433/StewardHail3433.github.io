export class ImageLoader {
    private images: Image[] = [];

    public constructor() {
        this.images.push(this.createImage("resources/typePlatformer/tiles/"));
    }


    private createImage(src: string): Image {
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