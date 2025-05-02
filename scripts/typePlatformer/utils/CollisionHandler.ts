import { Entity } from "../entity/Entity.js";
import { Player } from "../entity/player/Player.js";
import { Tiles } from "../world/Tiles.js";
import { WorldTile } from "../world/WorldTile.js";
import { containBox } from "./Collisions.js";
import { Constants } from "./Constants.js";

export class CollisionHandler {

    private playerCollisions: boolean = true;
    constructor() {

    }

    public update(entities: Entity[], chunks: Map<string, WorldTile[][]>, dt: number) {
        for(let i = 0; i < entities.length; i++) {
            //thanks to this dude he help me with the bug https://github.com/akon47/shoot_game/blob/master/player_class.js
            this.handleAxisEntityMovement("x", entities[i], dt);
            this.handleAxisCollision("x", entities[i], chunks);
            this.handleAxisEntityMovement("y", entities[i], dt)
            this.handleAxisCollision("y", entities[i], chunks);
        }
    }

    private handleAxisEntityMovement(axis: "x" | "y", entity: Entity, dt: number) {
        if(axis === "x") {
            entity.getHitboxComponent().setHitbox({...entity.getHitboxComponent().getHitbox(), x: entity.getHitboxComponent().getHitbox()[axis] + entity.getVelocity()[axis] * dt});
        } else {
            entity.getHitboxComponent().setHitbox({...entity.getHitboxComponent().getHitbox(), y: entity.getHitboxComponent().getHitbox()[axis] + entity.getVelocity()[axis] * dt});
        }
    }

    private handleAxisCollision(axis: "x" | "y", entity: Entity, chunks: Map<string, WorldTile[][]>) {
        if(entity instanceof Player && !this.playerCollisions) {
            return;
        }
        if (entity.getVelocity()[axis] != 0) {
            for(let [key, chunk] of chunks) {
                let x = parseInt(key.substring(0, key.indexOf(", ")))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                let y = parseInt(key.substring(key.indexOf(", ")+2))* Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                if(containBox(entity.getHitboxComponent().getHitbox(), {x,y,width: Constants.TILE_SIZE * Constants.CHUNK_SIZE, height: Constants.TILE_SIZE * Constants.CHUNK_SIZE})) {
                    for(let tx = 0; tx < Constants.CHUNK_SIZE; tx++) {
                        for(let ty = 0; ty < Constants.CHUNK_SIZE; ty++) {
                            if(containBox(entity.getHitboxComponent().getHitbox(), chunk[tx][ty].getHitboxComponent().getHitbox()) && chunk[tx][ty].getLayers()[entity.getLayer()].tile != Tiles.EMPTY) {

                                if (axis === "x") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entity.getHitboxComponent().setHitbox({
                                            ...entity.getHitboxComponent().getHitbox(), 
                                            x: chunk[tx][ty].getHitboxComponent().getHitbox().x - entity.getHitboxComponent().getHitbox().width
                                        });
                                    } else {
                                        entity.getHitboxComponent().setHitbox({
                                            ...entity.getHitboxComponent().getHitbox(),
                                            x: chunk[tx][ty].getHitboxComponent().getHitbox().x + Constants.TILE_SIZE
                                        });
                                    }
                                } else if (axis === "y") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entity.getHitboxComponent().setHitbox({
                                            ...entity.getHitboxComponent().getHitbox(), 
                                            y: chunk[tx][ty].getHitboxComponent().getHitbox().y - entity.getHitboxComponent().getHitbox().height
                                        });
                                    } else {
                                        entity.getHitboxComponent().setHitbox({
                                            ...entity.getHitboxComponent().getHitbox(),
                                            y: chunk[tx][ty].getHitboxComponent().getHitbox().y + Constants.TILE_SIZE
                                        });
                                    }
                                }
                                const updatedVel = entity.getVelocity();
                                updatedVel[axis] = 0;
                                entity.setVelocity(updatedVel);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    public setPlayerCollisions(boo: boolean) {
        this.playerCollisions = boo;
    }

}