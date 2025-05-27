import { Entity } from "../entity/Entity.js";
import { Player } from "../entity/player/Player.js";
import { ToolItem } from "../item/tools/ToolItem.js";
import { Tiles } from "../world/Tiles.js";
import { WorldTile } from "../world/WorldTile.js";
import { containBox, containEdge, rectCorners } from "./Collisions.js";
import { Constants } from "./Constants.js";

export class CollisionHandler {

    private playerCollisions: boolean = true;
    constructor() {

    }

    public update(entities: Entity[], unusedEntities: Entity[], chunks: Map<string, WorldTile[][]>, dt: number) {
        for(let i = 0; i < entities.length; i++) {
            //thanks to this dude he help me with the bug https://github.com/akon47/shoot_game/blob/master/player_class.js
            this.handleToolCollisions(entities[i], entities, unusedEntities);
            this.handleAxisEntityMovement("x", entities[i], dt);
            this.handleAxisCollision("x", entities[i], chunks);
            this.handleAxisEntityMovement("y", entities[i], dt)
            this.handleAxisCollision("y", entities[i], chunks);
        }
    }

    private handleToolCollisions(entity: Entity, entities: Entity[], unusedentities: Entity[]) {
        for(let i = 0; i < entities.length; i++) {
            if(entity == entities[i] || entity.getType() == entities[i].getType()) {
                continue;
            }
            if(entities[i].isUsingTool()) {
                const toolEntHitbox = entities[i].getHitboxComponent().getHitbox()
                if(containEdge(rectCorners(entity.getHitboxComponent().getHitbox()), entities[i].getToolHitboxPts())) {
                    entity.getHealthComponent().damage((entities[i].getToolSlot().getItem() as ToolItem).getDamage())
                    // if(entity.getHealthComponent().isDead()) {
                    //     this.handleEntityDeath(entity, unusedentities);
                    //     entities.splice(entities.find(entity), 1);
                    //     return;
                    // }
                    entity.applyKnockback({x: toolEntHitbox.x + toolEntHitbox.width/2, y: toolEntHitbox.y + toolEntHitbox.height/2}, 100);
                }
            }
        }
    }

    private handleEntityDeath(entity: Entity, unusedEntities: Entity[]) {
        // bro is dead
        if(entity.getType() != "player") unusedEntities.push(entity);
    }
    private handleAxisEntityMovement(axis: "x" | "y", entity: Entity, dt: number) {
        const entityHBComponent = entity.getHitboxComponent();
        const entityHB = entityHBComponent.getHitbox();
        if(axis === "x") {
            entityHBComponent.setHitbox({...entityHB, x: entityHB[axis] + entity.getVelocity()[axis] * dt});
        } else {
            entityHBComponent.setHitbox({...entityHB, y: entityHB[axis] + entity.getVelocity()[axis] * dt});
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
                const entHitboxComponent = entity.getHitboxComponent();
                const entHitbox = entHitboxComponent.getHitbox();
                if(containBox(entHitbox, {x,y,width: Constants.TILE_SIZE * Constants.CHUNK_SIZE, height: Constants.TILE_SIZE * Constants.CHUNK_SIZE})) {
                    for(let tx = 0; tx < Constants.CHUNK_SIZE; tx++) {
                        for(let ty = 0; ty < Constants.CHUNK_SIZE; ty++) {
                            const chunkHitbox = chunk[tx][ty].getHitboxComponent().getHitbox();
                            if(containBox(entHitbox, chunkHitbox) && chunk[tx][ty].getLayers()[entity.getLayer()].tile.getSettings().solid) {

                                if (axis === "x") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entHitboxComponent.setHitbox({
                                            ...entHitbox, 
                                            x: chunkHitbox.x - entHitbox.width
                                        });
                                    } else {
                                        entHitboxComponent.setHitbox({
                                            ...entHitbox,
                                            x: chunkHitbox.x + Constants.TILE_SIZE
                                        });
                                    }
                                } else if (axis === "y") {
                                    if (entity.getVelocity()[axis] > 0) {
                                        entHitboxComponent.setHitbox({
                                            ...entHitbox, 
                                            y: chunkHitbox.y - entHitbox.height
                                        });
                                    } else {
                                        entHitboxComponent.setHitbox({
                                            ...entHitbox,
                                            y: chunkHitbox.y + Constants.TILE_SIZE
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