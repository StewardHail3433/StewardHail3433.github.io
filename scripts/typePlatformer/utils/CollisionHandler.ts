import { Entity } from "../entity/Entity.js";
import { Tiles } from "../world/Tiles.js";
import { WorldTile } from "../world/WorldTile.js";
import { containBox } from "./Collisions.js";
import { Constants } from "./Constants.js";

export class CollisionHandler {
    constructor() {

    }

    public update(entities: Entity[], chunks: Map<string, WorldTile[][]>) {
        for(let i = 0; i < entities.length; i++) {
            if (entities[i].getVelocity().x != 0) {
                for(let [key, chunk] of chunks) {
                    let x = parseInt(key.substring(0, key.indexOf(", ")))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                    let y = parseInt(key.substring(key.indexOf(", ")+2))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                    if(containBox(entities[i].getHitboxComponent().getHitbox(), {x,y,width: Constants.TILE_SIZE * Constants.CHUNK_SIZE, height: Constants.TILE_SIZE * Constants.CHUNK_SIZE})) {
                        for(let tx = 0; tx < Constants.CHUNK_SIZE; tx++) {
                            for(let ty = 0; ty < Constants.CHUNK_SIZE; ty++) {
                                if(containBox(entities[i].getHitboxComponent().getHitbox(), chunk[tx][ty].getHitboxComponent().getHitbox()) && chunk[tx][ty].getLayers()[0].tile != Tiles.EMPTY) {

                                    if(entities[i].getVelocity().x > 0) {
                                        entities[i].getHitboxComponent().setHitbox({...entities[i].getHitboxComponent().getHitbox(), x: chunk[tx][ty].getHitboxComponent().getHitbox().x -  entities[i].getHitboxComponent().getHitbox().width});
                                    } else if(entities[i].getVelocity().x < 0) {
                                        entities[i].getHitboxComponent().setHitbox({...entities[i].getHitboxComponent().getHitbox(), x: chunk[tx][ty].getHitboxComponent().getHitbox().x + Constants.TILE_SIZE});
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (entities[i].getVelocity().y != 0) {
                for(let [key, chunk] of chunks) {
                    let x = parseInt(key.substring(0, key.indexOf(", ")))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                    let y = parseInt(key.substring(key.indexOf(", ")+2))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                    if(containBox(entities[i].getHitboxComponent().getHitbox(), {x,y,width: Constants.TILE_SIZE * Constants.CHUNK_SIZE, height: Constants.TILE_SIZE * Constants.CHUNK_SIZE})) {
                        for(let tx = 0; tx < Constants.CHUNK_SIZE; tx++) {
                            for(let ty = 0; ty < Constants.CHUNK_SIZE; ty++) {
                                if(containBox(entities[i].getHitboxComponent().getHitbox(), chunk[tx][ty].getHitboxComponent().getHitbox()) && chunk[tx][ty].getLayers()[0].tile != Tiles.EMPTY) {
                                    if(entities[i].getVelocity().y < 0) {
                                        entities[i].getHitboxComponent().setHitbox({...entities[i].getHitboxComponent().getHitbox(), y: chunk[tx][ty].getHitboxComponent().getHitbox().y + Constants.TILE_SIZE});
                                    } else if(entities[i].getVelocity().y > 0) {
                                        entities[i].getHitboxComponent().setHitbox({...entities[i].getHitboxComponent().getHitbox(), y: chunk[tx][ty].getHitboxComponent().getHitbox().y - entities[i].getHitboxComponent().getHitbox().height});
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}