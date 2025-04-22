import { Camera } from "../camera/Camera.js";
import { Constants } from "./Constants.js";

export class InputHandler {
    private keys: { [key: string]: boolean } = {};
    private keysToggled: { [key: string]: boolean } = {"F3": false};
    private mousePos: {x: number, y: number} = {x: 0, y: 0};
    private mouseDown: boolean = false;
    private canvas: HTMLCanvasElement;
    private scale: number = 1.0;
    private justClicked: boolean = false;



    constructor() {
        this.scale = 1.0;
        this.canvas = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;

        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));

        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
    }

    private handleKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        if (!(event.key in this.keysToggled)) {
            this.keysToggled[event.key] = false; 
        }
        if (!this.keys[event.key]) {
            this.keysToggled[event.key] = !this.keysToggled[event.key];
        }
        this.keys[event.key] = true;
    }

    private handleKeyUp(event: KeyboardEvent) {
        event.preventDefault();
        this.keys[event.key] = false;
    }


    private handleMouseDown(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        this.mouseDown = true;
        this.setJustClicked(true);
    }

    private handleMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
    }

    private handleMouseUp(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); 
        this.mousePos.x = event.clientX - rect.left - ((rect.width - Constants.CANVAS_WIDTH * this.scale) / 2);
        this.mousePos.y = event.clientY - rect.top - ((rect.height - Constants.CANVAS_HEIGHT * this.scale) / 2);
        this.mouseDown = false;
    }

    public getKeys(): { [key: string]: boolean } {
        return this.keys;
    }

    public getKeyToggled(): { [key: string]: boolean } {
        return this.keysToggled;
    }

    public getMousePosition(): {x: number, y: number} {
        return this.mousePos;
    }

    public getMouseWorldPosition(camera: Camera): {x: number, y: number} {
        let worldpos = {
            x: Math.floor((camera.getView().x*this.scale + this.mousePos.x) / (Constants.TILE_SIZE*this.scale)),
            y: Math.floor((camera.getView().y*this.scale + this.mousePos.y) / (Constants.TILE_SIZE*this.scale)),
        }
        return worldpos;
    }

    public isMouseDown(): boolean {
        return this.mouseDown;
    }

    public updateScale(scale: number) {
        this.scale = scale;
    }

    public wasJustClicked(): boolean {
        return this.justClicked;
    }
    
    public setJustClicked(bool: boolean) {
        this.justClicked = bool;
    }
    
}