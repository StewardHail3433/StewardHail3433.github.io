class TileImageLoader {
    constructor(tileSize) {
        this.tileSize = tileSize;
        this.images = {};
    }

    preloadImages(imageSources) {
        const promises = Object.entries(imageSources).map(([key, src]) => {
            return new Promise((resolve, reject) => {
                const img = new Image(this.tileSize, this.tileSize);
                img.src = src;
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${src}`);
                    reject(`Failed to load image: ${src}`);
                };
            });
        });

        return Promise.all(promises);
    }

    getImage(key) {
        return this.images[key] || null;
    }
}

export default TileImageLoader;
