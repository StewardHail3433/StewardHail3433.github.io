export function drawRoatatedImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, pt: {x: number, y: number}, angle: number) {
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.rotate(angle);
    ctx.drawImage(img, 0, 0);
    ctx.restore(); 
}