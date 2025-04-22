export class DroppedSlot {
    constructor(hitboxComponent, slot, velocity) {
        this.velocity = { x: 0, y: 0 };
        this.hitboxComponent = hitboxComponent;
        this.velocity = { x: 120, y: 120 };
        this.slot = slot;
    }
    update(dt, attactionPt) {
        this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, this.hitboxComponent.getHitbox()), { x: this.hitboxComponent.getHitbox().x + this.velocity.x * dt, y: this.hitboxComponent.getHitbox().y + this.velocity.y * dt }));
        if (attactionPt) {
            if (Math.sqrt(Math.pow(attactionPt.x - this.hitboxComponent.getHitbox().x, 2) + Math.pow(attactionPt.y - this.hitboxComponent.getHitbox().y, 2)) < 50) {
                let angle = Math.atan2(attactionPt.y - this.hitboxComponent.getHitbox().y, attactionPt.x - this.hitboxComponent.getHitbox().x);
                this.velocity.x = 30 * Math.cos(angle);
                this.velocity.y = 30 * Math.sin(angle);
            }
            else {
                this.velocity.x *= 0.90;
                this.velocity.y *= 0.90;
            }
        }
        else {
            this.velocity.x *= 0.90;
            this.velocity.y *= 0.90;
        }
    }
    render(ctx) {
        if (!this.slot.isEmpty()) {
            if (this.slot.getItem().getImage()) {
                ctx.drawImage(this.slot.getItem().getImage(), this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
            }
            else {
                ctx.fillStyle = "#FF13F0";
                ctx.fillRect(this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().height / 2);
                ctx.fillRect(this.hitboxComponent.getHitbox().x + this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().y + this.hitboxComponent.getHitbox().height / 2, this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().height / 2);
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y + this.hitboxComponent.getHitbox().height / 2, this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().height / 2);
                ctx.fillRect(this.hitboxComponent.getHitbox().x + this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width / 2, this.hitboxComponent.getHitbox().height / 2);
            }
        }
    }
    getHitboxComponent() {
        return this.hitboxComponent;
    }
    getSlot() {
        return this.slot;
    }
    setSlot(slot) {
        this.slot = slot;
    }
}
