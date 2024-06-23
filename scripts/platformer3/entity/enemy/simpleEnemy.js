import "../../utils/collisionChecker.js"
import { collision } from "../../utils/collisionChecker.js";
import { CONSTANTS } from "../../utils/gameConst.js";
import Enemy from "./enemy.js";
export default class SimpleEnemy extends Enemy  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map, camera, player, index) {
        super(ctx, map, camera, player, index)

        this.pos = {
            x: Math.floor(Math.random() * 3000),//ctx.canvas.width/2 - this.width/2,
            y: -500//ctx.canvas.height/2 - this.height/2
        }

        this.speed = 1 * CONSTANTS.movementScale; //pixels per second
        this.gravity = 5 * CONSTANTS.movementScale ; //pixels per second squared
        this.jumpSpeed = 3 * CONSTANTS.movementScale; //pixels per second

        this.direction = "left";
    }
    
    move(deltaTime) {
        if (this.direction == "left") {
            this.vel.x = -this.speed;
        } else if (this.direction == "right") {
            this.vel.x = this.speed;
        } else {
            this.vel.x = 0;
        }

        if (Math.floor(Math.random() * 1000) == 999 && this.grounded && this.vel.y === 0) {
            this.vel.y = -this.jumpSpeed;
            this.grounded = false;
        }

        this.pos.x += this.vel.x * deltaTime;

    }

    collisionOnX() {
        let doBreak = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if(tile.collision) {
                    if (collision(this, tile)) {
                        if (this.vel.x > 0) {
                            this.vel.x = 0;
                            this.pos.x = tile.pos.x - this.width - 0.01;
                            doBreak = true;
                            this.direction = "left";
                            break;
                        }
                        if (this.vel.x < 0) {
                            this.vel.x = 0;
                            this.pos.x = tile.pos.x + tile.width + 0.01;
                            doBreak = true;
                            this.direction = "right";
                            break;
                        }
                    }

                }
            }
            if(doBreak) {
                break;
            }
        }
    }
}