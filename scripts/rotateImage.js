function rotateImage(originalImage, angle, tileSize) {
    // Create a canvas for rotation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = tileSize;
    canvas.height = tileSize;

    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;

    // Perform rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(originalImage, -tileSize / 2, -tileSize / 2, tileSize, tileSize);

    // Create a new image and set the rotated canvas as its source
    const rotatedImage = new Image(tileSize, tileSize);
    rotatedImage.src = canvas.toDataURL();

    return rotatedImage;
}

export default rotateImage;
