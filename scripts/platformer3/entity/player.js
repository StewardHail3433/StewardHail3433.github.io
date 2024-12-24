
import "../utils/collisionChecker.js"
import { collision } from "../utils/collisionChecker.js";
import { CONSTANTS } from "../utils/gameConst.js";
export default class Player  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map, camera) {
        this.width = 10
        this.height = 29
        this.pos = {
            x: -1000,//ctx.canvas.width/2 - this.width/2,
            y: 0//ctx.canvas.height/2 - this.height/2
        }

        this.vel = {
            x: 0,
            y: 1,
        }

        this.keys = {
            w: false,

            a: false,

            s: false,

            d: false

        }
        this.speed = 1 * CONSTANTS.movementScale; //pixels per second
        this.gravity = 5 * CONSTANTS.movementScale ; //pixels per second squared
        this.liquidGravity = 3.5 * CONSTANTS.movementScale ; //pixels per second squared
        this.jumpSpeed = 3 * CONSTANTS.movementScale; //pixels per second

        this.ctx = ctx;
        this.grounded = false;

        this.map = map;
        this.camera = camera;

        this.alive = true;
        this.noDeathMode = false;

        this.inLiquid = false;
        this.inClimbable = false;

        this.img = new Image();
        this.img.src = "./resources/plat3/entities/player/playerIdle0.png";

        this.currentAnimation = "None";
        this.currentFrameIndex = 0;
        this.animationTimer = 0;
        this.frameDuration = 250;
    }

    update(deltaTime, enemies) {
        if(this.alive) {this.move(deltaTime);}
        this.collisionOnX();
        this.applyGravity(deltaTime);
        this.collisionOnY();
        if(!this.noDeathMode) {
            this.checkEnemiesDeath(enemies);
        }
        this.animationTimer += deltaTime * 1000;
        if(this.vel.x == 0 && this.currentAnimation != "idle") {
            this.currentAnimation = "idle";
        } else if (this.vel.x !== 0 && this.currentAnimation != "walk") {
            this.currentFrameIndex = 0;
            this.currentAnimation = "walk";
        }

    }

    render() {
        this.ctx.fillStyle = 'blue';
        //this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        //this.ctx.drawImage(this.img, this.pos.x, this.pos.y)
        
        
        if (this.animationTimer >= this.frameDuration) {
            this.animationTimer = 0;
            this.currentFrameIndex = (this.currentFrameIndex + 1) % (this.img.width / this.width)
        }
        if(this.currentAnimation == "idle") {
            this.img.src = "./resources/plat3/entities/player/playerIdle0.png";
        } else if (this.currentAnimation == "walk") {
            this.img.src = "./resources/plat3/entities/player/playerWalk.png";
        }
        this.ctx.drawImage(this.img,  this.currentFrameIndex * this.width, 0, this.width, this.height, this.pos.x, this.pos.y, this.width, this.height);

    }
    
    move(deltaTime){
        if (this.keys.a && this.keys.d) {
            this.vel.x = 0
        } else if (this.keys.a) {
            this.vel.x = -this.speed;
        } else if (this.keys.d) {
            this.vel.x = this.speed;
        } else {
            this.vel.x = 0;
        }
        if(!this.inLiquid) {
            if (this.keys.w && (this.grounded || this.inClimbable) && this.vel.y === 0) {
                this.vel.y = -this.jumpSpeed;
                this.grounded = false;
            }

            if (this.keys.s && this.inClimbable) {
                this.vel.y = this.jumpSpeed;
            }

            if(!this.keys.w && !this.keys.s && this.inClimbable) {
                this.vel.y = 0;
            }
        } else {
            if (this.keys.w && this.keys.s) {
                this.vel.y = 0
            } else if (this.keys.w) {
                this.vel.y = -this.speed;
            } else if (this.keys.s) {
                this.vel.y = this.speed;
            } else {
                //this.vel.y = 0;
            }
        }
        this.pos.x += this.vel.x * deltaTime;

    }

    keyDownInput(/** @type {KeyboardEvent} */ key) {
        if (key === "a") {
            this.keys.a = true;
        }
        if (key === "d") {
            this.keys.d = true;
        }
        if (key === "w" || key === "ArrowUp" || key === " " && this.grounded == true && this.vel.y == 0) {
            this.keys.w = true;
        }
        if (key === "s") {
            this.keys.s = true;
        }
    }

    keyUpInput(/** @type {KeyboardEvent} */ key) {
        if (key === "a") {
            this.keys.a = false;
        }
        if (key === "d") {
            this.keys.d = false;
        }
        if (key === "w" || key === "ArrowUp" || key === " ") {
            this.keys.w = false;
        }
        if (key === "s") {
            this.keys.s = false;
        }
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

    checkEnemiesDeath(enemies) {
        for(let i = 0; i < enemies.length; i++) {
            if(collision(this, enemies[i]) && this.pos.y + this.height > enemies[i].pos.y + enemies[i].height / 2) {
                this.alive = false;
            }
            if(enemies[i].projectileEnemy) {
                for(let j = 0; j < enemies[i].projectile.length; j++) {
                    if(collision(this, enemies[i].projectile[j])) {
                        enemies[i].projectile[j].delete = true;
                        this.alive = false;
                    };
                }
            }
        }
    }

    applyGravity(deltaTime) {
        let shouldApplyGravity = true;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[i].length; j++) {
                let tile = this.map[i][j];
                if(collision(this, tile) && tile.isClimbable) {
                    shouldApplyGravity = false;
                    this.inClimbable = true;
                    break;
                } else {
                    this.inClimbable = false;
                    
                }
            }
            if(shouldApplyGravity == false) {
                break;
            }
        }
        if(shouldApplyGravity) {
            this.vel.y += this.gravity * deltaTime;
        
            let appliedLiquidGravity = false;
            for (let i = 0; i < this.map.length; i++) {
                for (let j = 0; j < this.map[i].length; j++) {
                    let tile = this.map[i][j];
                    if(collision(this, tile) && tile.isLiquid) {
                        this.vel.y -= this.gravity * deltaTime;
                        this.vel.y += this.liquidGravity * deltaTime;

                        if(this.vel.y > 2 * CONSTANTS.movementScale) {
                            this.vel.y = 2 * CONSTANTS.movementScale
                        }
                        appliedLiquidGravity = true;
                        this.inLiquid = true;
                        break;
                    } else {
                        this.inLiquid = false;
                    }
                }
                if(appliedLiquidGravity) {
                    break;
                }
            }
        }

        this.pos.y += this.vel.y * deltaTime;
    }
}