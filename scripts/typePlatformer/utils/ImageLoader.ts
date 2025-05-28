export class ImageLoader {
    // https://www.youtube.com/watch?v=9j1dZwFEJ-c
    private static images: HTMLImageElement[] = [];
    private static imageSrcs = [
        "resources/typePlatformer/images/tiles/fields.png",
        "resources/typePlatformer/images/tiles/tree_leaves.png",
        "resources/typePlatformer/images/tiles/tree_stump.png",
        "resources/typePlatformer/images/entity/player/playerSheet.png",
        "resources/typePlatformer/images/entity/player/playerSheet3.png",
        "resources/typePlatformer/images/items/stick.png",
        "resources/typePlatformer/images/items/sword.png",
        "resources/typePlatformer/images/items/pickaxe.png",
        "resources/typePlatformer/images/entity/player/playerSheet2.png",
        "resources/typePlatformer/images/entity/player/duckMan.png",
        "resources/typePlatformer/images/entity/player/theVoid.png",
        "resources/typePlatformer/images/misc/mouseSelction.png",
        "resources/typePlatformer/images/misc/breaking.png",
        "resources/typePlatformer/images/items/tree_leaves.png",
        "resources/typePlatformer/images/items/tree_stump.png",
        "resources/typePlatformer/images/items/wood.png",
        "resources/typePlatformer/images/items/rock.png",
        "resources/typePlatformer/images/items/grass.png",
        "resources/typePlatformer/images/tiles/wood.png",
        "resources/typePlatformer/images/tiles/potion_bowl.png",
        "resources/typePlatformer/images/items/speed_up_potion.png",
        "resources/typePlatformer/images/items/sword2.png",
        "resources/typePlatformer/images/tiles/tool_loot_box.png",
        "resources/typePlatformer/images/items/flesh.png",
        "resources/typePlatformer/images/menu/main.png"];


    static getImages(): HTMLImageElement[]  {
        return this.images;
    }

    public static async loadAllImages(): Promise<HTMLImageElement[]> {
        const promises: Promise<HTMLImageElement>[] = [];
        for(let i = 0; i < this.imageSrcs.length; i++) {
            promises.push(this.loadImage(this.imageSrcs[i]));
        }        
        this.images = await Promise.all(promises);
        return this.images;
    }


    private static loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image()

            img.onload = () => {
                console.log("Image: Succesfully loaded -> " + src);
                resolve(img);
            }

            img.onerror = () => {
                console.log("Failed loading -> " + src);
                reject(new Error("Failed to load image: " + src));
            }

            img.src = src;
        });
    }
}