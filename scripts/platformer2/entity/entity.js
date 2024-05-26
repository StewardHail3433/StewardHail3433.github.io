export default class Entity {
    constructor(x, y, width = 50, height = 50, speed = 0, gravity = 0.5, /** @type {CanvasRenderingContext2D} */ ctx, collision, map) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.vx = 0; 
        this.vy = 0; 
        this.gravity = gravity; 
        this.grounded = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.isJumping = false;
        this.tryJumping = false;
        this.tryMovingLeft = false;
        this.tryMovingRight = false;
        this.collision = collision;
        this.map = map;
        /** @type {CanvasRenderingContext2D} */ this.ctx = ctx;
    }

    update(deltaTime) {
        this.collision.entityTileCollision(this, this.map)
        if(this.movingLeft && this.movingRight){
            this.vx = 0
        } else{
            if(!this.movingLeft && !this.movingRight){
                this.vx = 0
            } else{
                if(this.movingLeft && this.tryMovingLeft && !this.movingRight) {
                    this.vx = -this.speed;
                } 
                if(this.movingRight && this.tryMovingRight && !this.movingLeft) {
                    this.vx = this.speed;
                }
            }
            
        }
        if (!this.grounded) {
            this.vy += this.gravity;
            console.log("gravity");
        } 
        

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        // if (this.y + this.height >= this.ctx.canvas.height) {
        //     this.y = this.ctx.canvas.height - this.height;
        //     this.vy = 0;
        //     this.grounded = true;
        // } else {
        //     //this.grounded = false;
        // }
        
    }

    render() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}