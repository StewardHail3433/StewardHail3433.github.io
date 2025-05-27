import { Constants } from "./Constants";

export function drawRoatatedImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, pt: {x: number, y: number}, angle: number) {
    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.rotate(angle);
    ctx.drawImage(img, 0, 0);
    ctx.restore(); 
}

export function drawSpriteSheetSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, fps: number, direction: string, x: number, y: number, spriteWidth: number, spriteHeight: number) {
            const decimaltime = Constants.TIME_HANDLER.getTime() - Math.floor(Constants.TIME_HANDLER.getTime());
            let frameIndex = Math.floor(decimaltime * fps) % 4;

            let spriteY = 0;

            switch (direction) {
                case "down": 
                    spriteY = 0; 
                    break;
                case "up": 
                    spriteY = Constants.TILE_SIZE; 
                    break;
                case "left": 
                    spriteY = Constants.TILE_SIZE * 2;
                    frameIndex = Math.floor(decimaltime * fps) % 6; 
                    break;
                case "right": spriteY = Constants.TILE_SIZE * 3; 
                    frameIndex = Math.floor(decimaltime * fps) % 6; 
                    break;
            }
            let spriteX = frameIndex * Constants.TILE_SIZE;

            ctx.drawImage(
                img,
                spriteX, spriteY,
                spriteWidth, spriteHeight,
                x, //hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2),
                y, //hitbox.y + (hitbox.height) - Constants.TILE_SIZE,
                spriteWidth, spriteHeight
            );
        }
