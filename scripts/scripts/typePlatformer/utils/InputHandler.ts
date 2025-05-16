import { Camera } from "../camera/Camera.js";
import { Constants } from "./Constants.js";

export class InputHandler {
    private keys: { [key: string]: boolean } = {};
    private keysToggled: { [key: string]: boolean } = {"F3": false};
    private mousePos: {x: number, y: number} = {x: 0, y: 0};
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private middleDown: boolean = false;
    private leftDownToggled: boolean = false;
    private rightDownToggled: boolean = false;
    private middleDownToggled: boolean = false;
    private canvas: HTMLCanvasElement;
    private justLeftClicked: boolean = false;
    private justRightClicked: boolean = false;
    private justMiddleClicked: boolean = false;



    constructor() {
        this.canvas = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;

        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));

        document.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        document.addEventListener("mousemove", (event) => this.handleMouseMove(event));
        document.addEventListener("mouseup", (event) => this.handleMouseUp(event));
        this.canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
          
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
        this.mousePos.x = (event.clientX - rect.left) * (Constants.CANVAS_WIDTH / rect.width);
        this.mousePos.y = (event.clientY - rect.top) * (Constants.CANVAS_HEIGHT / rect.height);
        switch (event.button) {
            case 0:
                this.leftDown = true;
                this.leftDownToggled= !this.leftDownToggled;
                this.setJustLeftClicked(true);
                break;
            case 1:
                this.middleDown = true;
                this.middleDownToggled= !this.middleDownToggled;
                this.setJustMiddleClicked(true);
                break;
            case 2:
                this.rightDown = true;
                this.rightDownToggled= !this.rightDownToggled;
                this.setJustRightClicked(true);
                break;
        }
    }

    private handleMouseMove(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePos.x = (event.clientX - rect.left) * (Constants.CANVAS_WIDTH / rect.width);
        this.mousePos.y = (event.clientY - rect.top) * (Constants.CANVAS_HEIGHT / rect.height);
    }

    private handleMouseUp(event: MouseEvent) {
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
            x: Math.floor((camera.getView().x + this.mousePos.x / camera.getView().zoom)),
            y: Math.floor((camera.getView().y + this.mousePos.y / camera.getView().zoom)),
        }
        return worldpos;
    }

    public getMouseWorldTilePosition(camera: Camera): {x: number, y: number} {
        let worldpos = {
            x: Math.floor((camera.getView().x + this.mousePos.x / camera.getView().zoom) / (Constants.TILE_SIZE)),
            y: Math.floor((camera.getView().y + this.mousePos.y / camera.getView().zoom) / (Constants.TILE_SIZE)),
        }
        return worldpos;
    }

    public isLeftDown(): boolean {
        return this.leftDown;
    }

    public isRightDown(): boolean {
        return this.rightDown;
    }

    public isMiddleDown(): boolean {
        return this.middleDown;
    }

    public wasJustLeftClicked(): boolean {
        return this.justLeftClicked;
    }
    
    public setJustLeftClicked(bool: boolean) {
        this.justLeftClicked = bool;
    }

    public wasJustRightClicked(): boolean {
        return this.justRightClicked;
    }
    
    public setJustRightClicked(bool: boolean) {
        this.justRightClicked = bool;
    }

    public wasJustMiddleClicked(): boolean {
        return this.justMiddleClicked;
    }
    
    public setJustMiddleClicked(bool: boolean) {
        this.justMiddleClicked = bool;
    }

    public setToggle(key: string, value: boolean) {
        this.keysToggled[key] =value
    }

    public checkControl(control: string): boolean {
        if (control == "MLeft") {
            return this.isLeftDown();
        } else if (control == "MRight") {
            return this.isRightDown();
        } else if (control == "MMiddle") {
            return this.isMiddleDown();
        } else {
            return this.getKeys()[control];
        }
    }

    public checkControlToggle(control: string): boolean {
        if (control == "MLeft") {
            return this.leftDownToggled
        } else if (control == "MRight") {
            return this.rightDownToggled;
        } else if (control == "MMiddle") {
            return this.middleDownToggled;
        } else {
            return this.getKeyToggled()[control];
        }
    }

    public setKey(key: string, bool: boolean) {
        this.keys[key] = bool;
    }
    
}