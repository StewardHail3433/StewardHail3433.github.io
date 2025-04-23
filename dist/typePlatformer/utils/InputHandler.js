import { Constants } from "./Constants.js";
export class InputHandler {
    constructor() {
        this.keys = {};
        this.keysToggled = { "F3": false };
        this.mousePos = { x: 0, y: 0 };
        this.mouseDown = false;
        this.scale = 1.0;
        this.justClicked = false;
        this.scale = 1.0;
        this.canvas = document.getElementById(Constants.CANVAS_ID);
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
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
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        this.mouseDown = true;
        this.setJustClicked(true);
    }
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
    }
    handleMouseUp(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        this.mouseDown = false;
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
            x: Math.floor((camera.getView().x * this.scale + this.mousePos.x) / (Constants.TILE_SIZE * this.scale)),
            y: Math.floor((camera.getView().y * this.scale + this.mousePos.y) / (Constants.TILE_SIZE * this.scale)),
        };
        return worldpos;
    }
    isMouseDown() {
        return this.mouseDown;
    }
    updateScale(scale) {
        this.scale = scale;
    }
    wasJustClicked() {
        return this.justClicked;
    }
    setJustClicked(bool) {
        this.justClicked = bool;
    }
    setToggle(key, value) {
        this.keysToggled[key] = value;
    }
}
