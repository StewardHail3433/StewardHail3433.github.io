import { Entity } from "../entity/Entity";

export class Camera {
    private view: {x: number; y: number; width: number; height: number; zoom: number};
    private currentTrackEntity?: Entity
    constructor(view: {x: number; y: number; width: number; height: number; zoom: number}) {
        this.view = view;
    }

    update() {
        if(this.currentTrackEntity) {
            let entityHitbox: {x: number; y: number; width: number; height: number;} = this.currentTrackEntity.getHitboxComponent().getHitbox()
            this.view.x = (entityHitbox.x + entityHitbox.width / 2) - (this.view.width / 2 / this.view.zoom);
            this.view.y = (entityHitbox.y + entityHitbox.height / 2) - (this.view.height / 2 / this.view.zoom);
        }
    }

    public getView(): {x: number; y: number; width: number; height: number; zoom: number} {
        return {...this.view};
    }

    public trackEntity(x: Entity) {
        this.currentTrackEntity = x;
    }

    public stopTracking() {
        this.currentTrackEntity = undefined;
    }

    public setView(view: {x: number; y: number; width: number; height: number; zoom: number}) {
        this.view = view;
    }
}