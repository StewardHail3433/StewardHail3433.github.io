import "../../utils/collisionChecker.js"
import { collision } from "../../utils/collisionChecker.js";
import { CONSTANTS } from "../../utils/gameConst.js";
export default class Enemy  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map, camera, player, index) {
        this.width = 10
        this.height = 20
        this.pos = {
            x: 0,//ctx.canvas.width/2 - this.width/2,
            y: -500//ctx.canvas.height/2 - this.height/2
        }

        this.vel = {
            x: 0,
            y: 1,
        }
        this.speed = 1 * CONSTANTS.movementScale; //pixels per second
        this.gravity = 5 * CONSTANTS.movementScale ; //pixels per second squared
        this.jumpSpeed = 3 * CONSTANTS.movementScale; //pixels per second
        this.ctx = ctx;
        this.grounded = false;

        this.map = map;
        this.direction = "left";

        this.camera = camera;

        this.projectileEnemy = false;
        this.player = player;

        this.jumpChance = 1000;

        this.index = index;
        this.shouldDelete = false;

        this.noEnemyDeath = false;
    }

    update(deltaTime) {
        // console.log(deltaTime)
        if(!this.noEnemyDeath) {
            if (collision(this, this.player) && this.player.pos.y + this.player.height <= this.pos.y + this.height / 2) {
            this.shouldDelete = true;
            return; 
            }
        }
    

        this.move(deltaTime);
        this.collisionOnX();
        this.applyGravity(deltaTime);
        this.collisionOnY();
        //console.log(this.grounded);
    }

    render() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
    renderDev(){}

    move(deltaTime) {
        if (this.direction == "left") {
            this.vel.x = -this.speed;
        } else if (this.direction == "right") {
            this.vel.x = this.speed;
        } else {
            this.vel.x = 0;
        }

        if (Math.floor(Math.random() * this.jumpChance) == this.jumpChance-1 && this.grounded && this.vel.y === 0) {
            this.vel.y = -this.jumpSpeed;
            this.grounded = false;
        }

        this.pos.x += this.vel.x * deltaTime;

    }

    collisionOnY() {
        let doBreak = false;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if(tile.collision) {
                    if (collision(this, tile)) {
                        if (this.vel.y > 0) {
                            this.vel.y = 0;
                            this.pos.y = tile.pos.y - this.height - 0.01;
                            this.grounded = true;
                            doBreak = true;
                            break;
                        }
                        if (this.vel.y < 0) {
                            this.vel.y = 0;
                            this.pos.y = tile.pos.y + tile.height + 0.01;
                            doBreak = true;
                            break;
                        }
                    }
                }
            }
            if(doBreak) {
                break;
                
            }
        }
        if(this.pos.y + this.height >= this.ctx.canvas.height){
            this.vel.y = 0;
            this.pos.y = this.ctx.canvas.height - this.height;
            this.grounded = true;
        }
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
                            break;
                        }
                        if (this.vel.x < 0) {
                            this.vel.x = 0;
                            this.pos.x = tile.pos.x + tile.width + 0.01;
                            doBreak = true;
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

    applyGravity(deltaTime) {
        this.vel.y += this.gravity * deltaTime;
        this.pos.y += this.vel.y * deltaTime;
    }

    checkPlayerDeath() {
            if(collision(this.player, this) && this.shouldDelete) {
                this.player.alive = false;
            }
            if(this.projectileEnemy) {
                for(let j = 0; j < this.projectile.length; j++) {
                    if(collision(this, this.projectile[j])) {
                        this.player.alive = false;
                    };
                }
            }
    }
}