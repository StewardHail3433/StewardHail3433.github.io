import { Player } from "../entity/player/Player.js";
import { Tiles } from "../world/Tiles.js";
import { containBox } from "./Collisions.js";
import { Constants } from "./Constants.js";
export class CollisionHandler {
    constructor() {
        this.playerCollisions = true;
    }
    update(entities, chunks, dt) {
        for (let i = 0; i < entities.length; i++) {
            //thanks to this dude he help me with the bug https://github.com/akon47/shoot_game/blob/master/player_class.js
            this.handleAxisEntityMovement("x", entities[i], dt);
            this.handleAxisCollision("x", entities[i], chunks);
            this.handleAxisEntityMovement("y", entities[i], dt);
            this.handleAxisCollision("y", entities[i], chunks);
        }
    }
    handleAxisEntityMovement(axis, entity, dt) {
        if (axis === "x") {
            entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { x: entity.getHitboxComponent().getHitbox()[axis] + entity.getVelocity()[axis] * dt }));
        }
        else {
            entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { y: entity.getHitboxComponent().getHitbox()[axis] + entity.getVelocity()[axis] * dt }));
        }
    }
    handleAxisCollision(axis, entity, chunks) {
        if (entity instanceof Player && !this.playerCollisions) {
            return;
        }
        if (entity.getVelocity()[axis] != 0) {
            for (let [key, chunk] of chunks) {
                let x = parseInt(key.substring(0, key.indexOf(", "))) * Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                let y = parseInt(key.substring(key.indexOf(", ") + 2)) * Constants.TILE_SIZE * Constants.CHUNK_SIZE;
                if (containBox(entity.getHitboxComponent().getHitbox(), { x, y, width: Constants.TILE_SIZE * Constants.CHUNK_SIZE, height: Constants.TILE_SIZE * Constants.CHUNK_SIZE })) {
                    for (let tx = 0; tx < Constants.CHUNK_SIZE; tx++) {
                        for (let ty = 0; ty < Constants.CHUNK_SIZE; ty++) {
                            if (containBox(entity.getHitboxComponent().getHitbox(), chunk[tx][ty].getHitboxComponent().getHitbox()) && chunk[tx][ty].getLayers()[entity.getLayer()].tile != Tiles.EMPTY) {
                                if (axis === "x") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { x: chunk[tx][ty].getHitboxComponent().getHitbox().x - entity.getHitboxComponent().getHitbox().width }));
                                    }
                                    else {
                                        entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { x: chunk[tx][ty].getHitboxComponent().getHitbox().x + Constants.TILE_SIZE }));
                                    }
                                }
                                else if (axis === "y") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { y: chunk[tx][ty].getHitboxComponent().getHitbox().y - entity.getHitboxComponent().getHitbox().height }));
                                    }
                                    else {
                                        entity.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, entity.getHitboxComponent().getHitbox()), { y: chunk[tx][ty].getHitboxComponent().getHitbox().y + Constants.TILE_SIZE }));
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
    setPlayerCollisions(boo) {
        this.playerCollisions = boo;
    }
}
