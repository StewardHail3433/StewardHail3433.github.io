import "../../utils/collisionChecker.js"
import { collision } from "../../utils/collisionChecker.js";
import { CONSTANTS } from "../../utils/gameConst.js";
import Projectile from "../projectile/projectile.js";
import SimpleEnemy from "./simpleEnemy.js";
export default class ShooterEnemy extends SimpleEnemy  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map, camera, player, pos, sound, index) {
        super(ctx, map, camera, player, sound, index)

        this.pos = pos;

        this.speed = 1 * CONSTANTS.movementScale; //pixels per second
        this.gravity = 5 * CONSTANTS.movementScale ; //pixels per second squared
        this.jumpSpeed = 3 * CONSTANTS.movementScale; //pixels per second

        this.projectileEnemy = true;
        this.aimo = 5;
        this.projectile = []
        this.lastShotElapsedTime = 0;
        
    }


    render() {
        this.ctx.fillStyle = 'purple';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        for(let i = 0; i < this.projectile.length; i++) {
            this.projectile[i].render();
        }
    }

    update(deltaTime, elapsedTime){
        super.update(deltaTime);

        this.shoot(elapsedTime)
        for(let i = 0; i < this.projectile.length; i++) {
            this.projectile[i].update(deltaTime);
            if(this.projectile[i].delete){
                this.projectile.splice(i, 1)
            }
        }
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

    shoot(elapsedTime){
        if(Math.floor(this.lastShotElapsedTime) + 2 <= Math.floor(elapsedTime) && this.aimo > 0) {
            let projectileDirection = "right";
            if(this.pos.x > this.player.pos.x) {
                projectileDirection = "left";
            }
            this.sound.play("sfx", 1);
            this.projectile.push(new Projectile(this.ctx, ((this.player.pos.y - this.pos.y) / (this.player.pos.x - this.pos.x)), this.pos, projectileDirection, this.projectile.length))
            this.lastShotElapsedTime = elapsedTime;
            this.aimo--
        }
        if(this.aimo == 0 && Math.floor(this.lastShotElapsedTime) + 4 <= Math.floor(elapsedTime)) {
            this.aimo = 5;
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
                //console.log("wda")
                break;
                
            }
        }
        if(this.pos.y + this.height >= this.ctx.canvas.height){
            this.vel.y = 0;
            this.pos.y = this.ctx.canvas.height - this.height;
            this.grounded = true;
        }
    }

    // collisionOnX() {
    //     let doBreak = false;
    //     for (let i = 0; i < this.map.length; i++) {
    //         for (let j = 0; j < this.map[i].length; j++) {
    //             let tile = this.map[i][j];
    //             if(tile.collision) {
    //                 if (collision(this, tile)) {
    //                     if (this.vel.x > 0) {
    //                         this.vel.x = 0;
    //                         this.pos.x = tile.pos.x - this.width - 0.01;
    //                         doBreak = true;
    //                         break;
    //                     }
    //                     if (this.vel.x < 0) {
    //                         this.vel.x = 0;
    //                         this.pos.x = tile.pos.x + tile.width + 0.01;
    //                         doBreak = true;
    //                         break;
    //                     }
    //                 }

    //             }
    //         }
    //         if(doBreak) {
    //             break;
    //         }
    //     }
    // }

    keyUpInput(/** @type {KeyboardEvent} */ key) {
        if (key === "x") {
            this.shoot();
        }
    }
}