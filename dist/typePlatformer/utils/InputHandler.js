import { Constants } from "./Constants.js";
export class InputHandler {
    constructor() {
        this.keys = {};
        this.keysToggled = { "F3": false };
        this.mousePos = { x: 0, y: 0 };
        this.leftDown = false;
        this.rightDown = false;
        this.middleDown = false;
        this.leftDownToggled = false;
        this.rightDownToggled = false;
        this.middleDownToggled = false;
        this.justLeftClicked = false;
        this.justRightClicked = false;
        this.justMiddleClicked = false;
        this.canvas = document.getElementById(Constants.CANVAS_ID);
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
        this.canvas.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
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
    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = (event.clientX - rect.left) * (Constants.CANVAS_WIDTH / rect.width);
        this.mousePos.y = (event.clientY - rect.top) * (Constants.CANVAS_HEIGHT / rect.height);
        switch (event.button) {
            case 0:
                this.leftDown = true;
                this.leftDownToggled = !this.leftDownToggled;
                this.setJustLeftClicked(true);
                break;
            case 1:
                this.middleDown = true;
                this.middleDownToggled = !this.middleDownToggled;
                this.setJustMiddleClicked(true);
                break;
            case 2:
                this.rightDown = true;
                this.rightDownToggled = !this.rightDownToggled;
                this.setJustRightClicked(true);
                break;
        }
    }
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = (event.clientX - rect.left) * (Constants.CANVAS_WIDTH / rect.width);
        this.mousePos.y = (event.clientY - rect.top) * (Constants.CANVAS_HEIGHT / rect.height);
    }
    handleMouseUp(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = (event.clientX - rect.left) * (Constants.CANVAS_WIDTH / rect.width);
        this.mousePos.y = (event.clientY - rect.top) * (Constants.CANVAS_HEIGHT / rect.height);
        switch (event.button) {
            case 0:
                this.leftDown = false;
                break;
            case 1:
                this.middleDown = false;
                break;
            case 2:
                this.rightDown = false;
                break;
        }
    }
    getKeys() {
        return this.keys;
    }
    getKeyToggled() {
        return this.keysToggled;
    }
    getMousePosition() {
        return this.mousePos;
    }
    getMouseWorldPosition(camera) {
        let worldpos = {
            x: Math.floor((camera.getView().x + this.mousePos.x / camera.getView().zoom)),
            y: Math.floor((camera.getView().y + this.mousePos.y / camera.getView().zoom)),
        };
        return worldpos;
    }
    getMouseWorldTilePosition(camera) {
        let worldpos = {
            x: Math.floor((camera.getView().x + this.mousePos.x / camera.getView().zoom) / (Constants.TILE_SIZE)),
            y: Math.floor((camera.getView().y + this.mousePos.y / camera.getView().zoom) / (Constants.TILE_SIZE)),
        };
        return worldpos;
    }
    isLeftDown() {
        return this.leftDown;
    }
    isRightDown() {
        return this.rightDown;
    }
    isMiddleDown() {
        return this.middleDown;
    }
    wasJustLeftClicked() {
        return this.justLeftClicked;
    }
    setJustLeftClicked(bool) {
        this.justLeftClicked = bool;
    }
    wasJustRightClicked() {
        return this.justRightClicked;
    }
    setJustRightClicked(bool) {
        this.justRightClicked = bool;
    }
    wasJustMiddleClicked() {
        return this.justMiddleClicked;
    }
    setJustMiddleClicked(bool) {
        this.justMiddleClicked = bool;
    }
    setToggle(key, value) {
        this.keysToggled[key] = value;
    }
    checkControl(control) {
        if (control == "MLeft") {
            return this.isLeftDown();
        }
        else if (control == "MRight") {
            return this.isRightDown();
        }
        else if (control == "MMiddle") {
            return this.isMiddleDown();
        }
        else {
            return this.getKeys()[control];
        }
    }
    checkControlToggle(control) {
        if (control == "MLeft") {
            return this.leftDownToggled;
        }
        else if (control == "MRight") {
            return this.rightDownToggled;
        }
        else if (control == "MMiddle") {
            return this.middleDownToggled;
        }
        else {
            return this.getKeyToggled()[control];
        }
    }
    setKey(key, bool) {
        this.keys[key] = bool;
    }
}
