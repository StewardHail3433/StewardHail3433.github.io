import "../../utils/collisionChecker.js"
import { collision } from "../../utils/collisionChecker.js";
import { CONSTANTS } from "../../utils/gameConst.js";
import CanonballProjectile from "../projectile/canonballProjectile.js";
import ShooterEnemy from "./shooterEnemy.js";
export default class CanonEnemy extends ShooterEnemy  {
    
    constructor(/** @type {CanvasRenderingContext2D} */ ctx, map, camera, player, pos, index) {
        super(ctx, map, camera, player, pos, index)

        this.pos = pos;

        this.speed = 1.2 * CONSTANTS.movementScale; //pixels per second
        this.gravity = 4 * CONSTANTS.movementScale ; //pixels per second squared
        this.jumpSpeed = 4 * CONSTANTS.movementScale; //pixels per second
        this.jumpChance = 2;

        this.projectileEnemy = true;
        this.aimo = 7;
        this.projectile = []
        this.lastShotElapsedTime = 0;
    }


    render() {
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        for(let i = 0; i < this.projectile.length; i++) {
            this.projectile[i].render();
        }
    }

    renderDev() {
        console.log("hsbad");
        const midX = (this.pos.x+this.width/2 + this.player.pos.x+this.player.width/2 ) / 2;
        const midY = (this.pos.y + this.player.pos.y) / 2;

        const controlX = midX;
        const controlY = midY - 100; 
        this.ctx.save();  
        this.ctx.scale(CONSTANTS.canvasScale, CONSTANTS.canvasScale);
        this.ctx.translate(Math.round(-this.camera.pos.x), Math.round(-this.camera.pos.y));
        this.ctx.strokeStyle = 'rgba(15, 255, 80, 0.5)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.pos.x+this.width/2, this.pos.y); 
        this.ctx.quadraticCurveTo(controlX, controlY, this.player.pos.x+this.player.width/2, this.player.pos.y);
        this.ctx.stroke();
        this.ctx.restore();
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
        if(Math.floor(this.lastShotElapsedTime) + 0.5 <= Math.floor(elapsedTime) && this.aimo > 0) {
            let projectileDirection = "right";
            if(this.pos.x > this.player.pos.x) {
                projectileDirection = "left";
            }
            this.projectile.push(new CanonballProjectile(
                this.ctx, 
                {x:this.pos.x+this.width/2, y:this.pos.y}, 
                {x:this.player.pos.x+this.player.width/2, y: this.player.pos.y}, 
                this.projectile.length
            ));
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