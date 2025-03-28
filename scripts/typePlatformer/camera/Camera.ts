import { Entity } from "../entity/Enity";

export class Camera {
    private view: {x: number; y: number; width: number; height: number};
    private currentTrackEntity?: Entity
    constructor(view: {x: number; y: number; width: number; height: number}) {
        this.view =view;
    }

    update() {
        if(this.currentTrackEntity) {
            let entityHitbox: {x: number; y: number; width: number; height: number;} = this.currentTrackEntity.getHitboxComponent().getHitbox()
            this.view.x = (entityHitbox.x + entityHitbox.width/2) - this.view.width/2;
            this.view.y = (entityHitbox.y + entityHitbox.height/2) - this.view.height/2;
            console.log(this.view.x, this.view.y)
        }
    }

    public getView(): {x: number; y: number; width: number; height: number} {
        return this.view;
    }

    public trackEntity(x: Entity) {
        this.currentTrackEntity = x;
    }

    public stopTracking() {
        this.currentTrackEntity = undefined;
    }
}