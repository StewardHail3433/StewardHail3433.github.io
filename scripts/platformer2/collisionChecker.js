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
                    if(playerBottom >= tileTop && playerTop <= tileBottom && playerRight >= tileLeft && playerLeft <= tileRight) {
                        if(playerBottom - entity.vy >= tileTop && entity.grounded == false && entity.vy > 0 ) {
                            entity.y = tileTop - entity.height;
                            entity.vy = 0;
                            entity.grounded = true;
                            entity.isJumping = false;
                            break;
                        }
                    } //else if(playerBottom < tileTop) {
                    //     entity.grounded = false;
                        
                    // }
                    if(playerBottom <= tileBottom && playerTop >= tileTop && playerRight >= tileLeft && playerLeft <= tileLeft) {
                        if(playerRight + entity.vx >= tileLeft && entity.movingRight) {
                            entity.x = tileLeft - entity.width;
                            entity.vx =0;
                            entity.movingRight =false;
                            //console.log("hi");
                        }
                    }
                    
                    if (playerBottom <= tileBottom && playerTop >= tileTop && playerLeft <= tileRight && playerRight >= tileRight) {
                        if (playerLeft + entity.vx <= tileRight && entity.movingLeft) {
                            entity.x = tileRight;
                            entity.vx = 0;
                            entity.movingLeft = false;
                        }
                    }

                    // Check for collision from bottom
                    if (playerTop <= tileBottom && playerBottom >= tileTop && playerRight >= tileLeft && playerLeft <= tileRight) {
                        if (playerTop + entity.vy <= tileBottom && entity.vy < 0) {
                            entity.y = tileBottom;
                            entity.vy = 0;
                        }
                    }

                }
            }
        }
    }
}