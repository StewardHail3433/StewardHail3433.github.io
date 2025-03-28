export class Camera {
    constructor(view) {
        this.view = view;
    }
    update() {
        if (this.currentTrackEntity) {
            let entityHitbox = this.currentTrackEntity.getHitboxComponent().getHitbox();
            this.view.x = (entityHitbox.x + entityHitbox.width / 2) - this.view.width / 2;
            this.view.y = (entityHitbox.y + entityHitbox.height / 2) - this.view.height / 2;
            console.log(this.view.x, this.view.y);
        }
    }
    getView() {
        return this.view;
    }
    trackEntity(x) {
        this.currentTrackEntity = x;
    }
    stopTracking() {
        this.currentTrackEntity = undefined;
    }
}
