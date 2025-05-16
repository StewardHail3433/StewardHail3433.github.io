import Entity from "./entity/entity.js";
import Tile from "./map/tile.js";

export default class CollisionChecker {
    entitiyTileCollision(/** @type {Entity}} */entity, /** @type {Tile[][]} */map) {
        const playerLeft = entity.x;
        const playerRight = entity.x + entity.width;
        const playerTop = entity.y;
        const playerBottom = entity.y + entity.height;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if(map[i][j].collision) {
                    const tileLeft = map[i][j].x;
                    const tileRight = map[i][j].x + map[i][j].width;
                    const tileTop = map[i][j].y;
                    const tileBottom = map[i][j].y + map[i][j].height;
                    if(playerBottom >= tileTop && playerTop <= tileBottom && playerRight >= tileLeft && playerLeft <= tileRight) {
                        if(playerBottom - entity.vy >= tileTop && !entity.grounded) {
                            entity.y = tileTop - entity.height;
                            entity.vy = 0;
                            entity.grounded = true;
                            entity.isJumping = false;
                            console.log("hi");
                        }
                    } else if(playerBottom < tileTop) {
                        entity.grounded = false;
                        
                    }
                }
            }
        }
    }
}