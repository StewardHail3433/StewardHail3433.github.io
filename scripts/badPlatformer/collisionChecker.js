import Block from "./block.js";
import Player from "./player.js";

export default class collisionChecker {

    constructor() {
    }

    collisionPlayerBlock(/** @type {Player} */ player, /** @type {Block} */ block) {
        let colDir = null;

        // Player and block boundaries
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;

        const blockLeft = block.x;
        const blockRight = block.x + block.width;
        const blockTop = block.y;
        const blockBottom = block.y + block.height;

        if (block.collision) {
            const overlapX = Math.min(playerRight, blockRight) - Math.max(playerLeft, blockLeft);
            const overlapY = Math.min(playerBottom, blockBottom) - Math.max(playerTop, blockTop);

            if (overlapX > 0 && overlapY > 0) {
                if (overlapX < overlapY) {
                    if (playerLeft < blockLeft) {
                        colDir = "right";
                    } else {
                        colDir = "left";
                    }
                } else {
                    if (playerTop < blockTop) {
                        colDir = "down";
                    } else {
                        colDir = "up";
                    }
                }
            }
        }

        return colDir;
    }
}
