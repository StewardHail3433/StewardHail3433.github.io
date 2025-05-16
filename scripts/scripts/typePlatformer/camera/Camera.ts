import { Entity } from "../entity/Entity.js";
import { Constants } from "../utils/Constants.js";

export class Camera {
    private view: {x: number; y: number; width: number; height: number; zoom: number};
    private currentTrackEntity?: Entity
    private id: string;
    constructor(view: {x: number; y: number; width: number; height: number; zoom: number}, id: string) {
        this.view = view;
        this.id = id;

        Constants.COMMAND_SYSTEM.addCommand("zoom", (args: string[]) => {
            if(args[0] == this.id) {
                this.view.zoom = parseFloat(args[1]);
            }
        })
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