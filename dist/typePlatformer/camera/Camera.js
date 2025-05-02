import { Constants } from "../utils/Constants.js";
export class Camera {
    constructor(view, id) {
        this.view = view;
        this.id = id;
        Constants.COMMAND_SYSTEM.addCommand("zoom", (args) => {
            if (args[0] == this.id) {
                this.view.zoom = parseFloat(args[1]);
            }
        });
    }
    update() {
        if (this.currentTrackEntity) {
            let entityHitbox = this.currentTrackEntity.getHitboxComponent().getHitbox();
            this.view.x = (entityHitbox.x + entityHitbox.width / 2) - (this.view.width / 2 / this.view.zoom);
            this.view.y = (entityHitbox.y + entityHitbox.height / 2) - (this.view.height / 2 / this.view.zoom);
        }
    }
    getView() {
        return Object.assign({}, this.view);
    }
    trackEntity(x) {
        this.currentTrackEntity = x;
    }
    stopTracking() {
        this.currentTrackEntity = undefined;
    }
    setView(view) {
        this.view = view;
    }
}
