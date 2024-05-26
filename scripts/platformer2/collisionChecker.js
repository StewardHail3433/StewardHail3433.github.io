import Entity from "./entity/entity.js";
import Tile from "./map/tile.js";

export default class CollisionChecker {
    entityTileCollision(/** @type {Entity}} */entity, /** @type {Tile[][]} */map) {
        const playerLeft = entity.x;
        const playerRight = entity.x + entity.width;
        const playerTop = entity.y;
        const playerBottom = entity.y + entity.height;
        entity.grounded = false;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if(map[i][j].collision) {
                    const tileLeft = map[i][j].x;
                    const tileRight = map[i][j].x + map[i][j].width;
                    const tileTop = map[i][j].y;
                    const tileBottom = map[i][j].y + map[i][j].height;
                    
                    //  collision from top
                    if (playerBottom + entity.vy >= tileTop && playerTop < tileTop && playerRight > tileLeft && playerLeft < tileRight) {
                        entity.y = tileTop - entity.height;
                        entity.vy = 0;
                        entity.grounded = true;
                    }

                    //  collision from right
                    if (playerRight + entity.vx >= tileLeft && playerLeft < tileLeft && playerBottom > tileTop && playerTop < tileBottom) {
                        entity.x = tileLeft - entity.width;
                        entity.vx = 0;
                        entity.movingRight = false;
                    }

                    // collision from left
                    if (playerLeft + entity.vx <= tileRight && playerRight > tileRight && playerBottom > tileTop && playerTop < tileBottom) {
                        entity.x = tileRight;
                        entity.vx = 0;
                        entity.movingLeft = false;
                    }

                    //  collision from bottom
                    if (playerTop + entity.vy <= tileBottom && playerBottom > tileBottom && playerRight > tileLeft && playerLeft < tileRight) {
                        entity.y = tileBottom;
                        entity.vy = 0;
                    }


                }
            }
        }
        
    }
}