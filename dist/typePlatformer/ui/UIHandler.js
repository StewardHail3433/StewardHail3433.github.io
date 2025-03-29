import { UIComponent } from "../components/ui/UIComponent.js";
import { UIComponentButton } from "../components/ui/UIComponentButton.js";
import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { Constants } from "../utils/Constants.js";
import { UIChatHandler } from "./UIChatHandler.js";
export class UIHandler {
    constructor(canvas, player, camera) {
        this.keys = {};
        this.keysToggled = { "F3": false };
        this.debug = new UIComponent({
            x: 0, y: 0, width: canvas.width / 5, height: canvas.height
        }, { red: 255, green: 0, blue: 0, alpha: 0.5 }, true);
        this.debugInfo = new UIComponentLabel({
            x: 5, y: 5, width: this.debug.getHitbox().width - 10, height: 80
        }, { red: 0, green: 255, blue: 0 }, true, "Boo", { red: 0, green: 0, blue: 255 }, 9);
        this.debugTeleportToCenterButton = new UIComponentButton(canvas, {
            x: 5, y: 90, width: this.debug.getHitbox().width - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Teleport Center", { red: 0, green: 0, blue: 255 }, 9, "center", { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => { });
        this.camera = camera;
        this.debugZoomIn = new UIComponentButton(canvas, {
            x: 5, y: 120, width: (this.debug.getHitbox().width - 10) / 2 - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Zoom In", { red: 0, green: 0, blue: 255 }, 9, "center", { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => {
            this.camera.setView(Object.assign(Object.assign({}, this.camera.getView()), { zoom: this.camera.getView().zoom + 0.25 }));
        });
        this.debugZoomOut = new UIComponentButton(canvas, {
            x: 5 + (this.debug.getHitbox().width - 10) / 2 + 10, y: 120, width: (this.debug.getHitbox().width - 10) / 2 - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Zoom Out", { red: 0, green: 0, blue: 255 }, 9, "center", { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => {
            this.camera.setView(Object.assign(Object.assign({}, this.camera.getView()), { zoom: Math.max(this.camera.getView().zoom - 0.25, 0.25) }));
        });
        this.debugSpeedUp = new UIComponentButton(canvas, {
            x: 5, y: 150, width: (this.debug.getHitbox().width - 10) / 2 - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Increase Speed", { red: 0, green: 0, blue: 255 }, 9, "center", { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => {
            this.player.setSpeed(this.player.getSpeed() + 15);
        });
        this.debugSpeedDown = new UIComponentButton(canvas, {
            x: 5 + (this.debug.getHitbox().width - 10) / 2 + 10, y: 150, width: (this.debug.getHitbox().width - 10) / 2 - 10, height: 20
        }, { red: 0, green: 255, blue: 0 }, true, "Decrease Speed", { red: 0, green: 0, blue: 255 }, 9, "center", { red: 123, green: 123, blue: 0 }, undefined, { red: 255, green: 0, blue: 255 }, () => {
            this.player.setSpeed(this.player.getSpeed() - 15);
        });
        this.uiChatHandler = new UIChatHandler(canvas, new UIComponent({
            x: Constants.CANVAS_WIDTH - Constants.CANVAS_WIDTH / 5, y: 0, width: Constants.CANVAS_WIDTH / 5, height: Constants.CANVAS_HEIGHT / 2
        }, { red: 255, green: 0, blue: 0, alpha: 0.5 }, false));
        this.debug.hide();
        this.debugInfo.hide();
        this.debugTeleportToCenterButton.hide();
        this.debugSpeedUp.setParentComponent(this.debug);
        this.debugSpeedDown.setParentComponent(this.debug);
        this.debugZoomIn.setParentComponent(this.debug);
        this.debugZoomOut.setParentComponent(this.debug);
        this.debugInfo.setParentComponent(this.debug);
        this.debugTeleportToCenterButton.setParentComponent(this.debug);
        this.player = player;
        this.playermovement = this.player.getMovementButton(canvas);
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
        Constants.COMMAND_SYSTEM.addCommand("debug", (args) => {
            if (args[0] === "show") {
                this.keysToggled["F3"] = true;
            }
            else if (args[0] === "hide") {
                this.keysToggled["F3"] = false;
            }
        });
    }
    render(ctx) {
        this.debug.render(ctx);
        this.debugInfo.render(ctx);
        this.debugTeleportToCenterButton.render(ctx);
        if (this.player.getTouchMode() && this.playermovement) {
            for (var button of this.playermovement) {
                button.render(ctx);
            }
        }
        this.debugZoomIn.render(ctx);
        this.debugZoomOut.render(ctx);
        this.debugSpeedUp.render(ctx);
        this.debugSpeedDown.render(ctx);
        this.uiChatHandler.render(ctx);
    }
    update() {
        var _a, _b, _c;
        this.debugInfo.update("Player coord: (" + ((_a = (this.player.getHitboxComponent().getHitbox().x)) === null || _a === void 0 ? void 0 : _a.toFixed(0)) + ", " + ((_c = ((_b = this.player) === null || _b === void 0 ? void 0 : _b.getHitboxComponent().getHitbox().y)) === null || _c === void 0 ? void 0 : _c.toFixed(0)) + ")\nPlayer Direction: " + this.player.getDirection() + "\nCamera zoom" + this.camera.getView().zoom + "\nPlayer speed: " + this.player.getSpeed());
        this.debugTeleportToCenterButton.setOnTrue(() => {
            this.player.getHitboxComponent().setHitbox(Object.assign(Object.assign({}, this.player.getHitboxComponent().getHitbox()), { x: 480 / 2, y: 320 / 2 }));
        });
        this.debugTeleportToCenterButton.update();
        this.debugZoomIn.update();
        this.debugZoomOut.update();
        this.debugSpeedUp.update();
        this.debugSpeedDown.update();
        this.uiChatHandler.update();
        if (this.keysToggled["F3"]) {
            this.debug.show();
            this.debugInfo.show();
            this.debugTeleportToCenterButton.show();
            this.debugZoomIn.show();
            this.debugZoomOut.show();
            this.debugSpeedUp.show();
            this.debugSpeedDown.show();
        }
        else {
            this.debug.hide();
            this.debugInfo.hide();
            this.debugTeleportToCenterButton.hide();
            this.debugZoomIn.hide();
            this.debugZoomOut.hide();
            this.debugSpeedUp.hide();
            this.debugSpeedDown.hide();
        }
        if (this.keysToggled["l"]) {
            this.player.setToKeyboard();
        }
        else {
            this.player.setToTouch();
        }
        if (this.player.getTouchMode() && this.playermovement) {
            for (var button of this.playermovement) {
                button.update();
            }
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
    getChatHandler() {
        return this.uiChatHandler;
    }
}
