import { UIComponent } from "../components/ui/UIComponent.js";
import { UIComponentButton } from "../components/ui/UIComponentButton.js";
import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
export class UIHandler {
    ;
    constructor(canvas) {
        this.keys = {};
        this.keysToggled = { "F3": false };
        this.debug = new UIComponent({
            x: 0, y: 0, width: canvas.width / 5, height: canvas.height
        }, { red: 255, green: 0, blue: 0, alpha: 0.5 }, true);
        this.debugInfo = new UIComponentLabel({
            x: 5, y: 5, width: this.debug.getHitbox().width - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Boo", { red: 0, green: 0, blue: 255 }, 9);
        this.debugTeleportToCenterButton = new UIComponentButton(canvas, {
            x: 5, y: 30, width: this.debug.getHitbox().width - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Teleport Center", { red: 0, green: 0, blue: 255 }, 9, { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => { });
        this.debug.hide();
        this.debugInfo.hide();
        this.debugTeleportToCenterButton.hide();
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }
    render(ctx) {
        this.debug.render(ctx);
        this.debugInfo.render(ctx, this.debug);
        this.debugTeleportToCenterButton.render(ctx, this.debug);
    }
    update(player) {
        var _a, _b;
        this.debugInfo.update("Player coord: (" + ((_a = (player === null || player === void 0 ? void 0 : player.getHitboxComponent().getHitbox().x)) === null || _a === void 0 ? void 0 : _a.toFixed(0)) + ", " + ((_b = (player === null || player === void 0 ? void 0 : player.getHitboxComponent().getHitbox().y)) === null || _b === void 0 ? void 0 : _b.toFixed(0)) + ")");
        this.debugTeleportToCenterButton.setAction(() => {
            player === null || player === void 0 ? void 0 : player.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, player.getHitboxComponent().getHitbox()), { x: 480 / 2, y: 320 / 2 }));
        });
        this.debugTeleportToCenterButton.update();
        if (this.keysToggled["F3"]) {
            this.debug.show();
            this.debugInfo.show();
            this.debugTeleportToCenterButton.show();
        }
        else {
            this.debug.hide();
            this.debugInfo.hide();
            this.debugTeleportToCenterButton.hide();
        }
    }
    handleKeyDown(event) {
        event.preventDefault();
        if (!(event.key in this.keysToggled)) {
            this.keysToggled[event.key] = false;
        }
        if (!this.keys[event.key]) {
            this.keysToggled[event.key] = !this.keysToggled[event.key];
        }
        this.keys[event.key] = true;
    }
    handleKeyUp(event) {
        event.preventDefault();
        this.keys[event.key] = false;
    }
}
