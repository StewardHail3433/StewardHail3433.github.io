import { CommandSystem } from "./CommandSystem.js";
import { InputHandler } from "./InputHandler.js";
import { TimeHandler } from "./TimeHandler.js";

export class Constants {
    public static readonly CANVAS_WIDTH = 640;
    public static readonly CANVAS_HEIGHT = 360;
    public static readonly TILE_SIZE = 16;
    public static readonly WORLD_WIDTH = 50;
    public static readonly WORLD_HEIGHT = 50;
    public static readonly COMMAND_SYSTEM = new CommandSystem();
    public static readonly CHUNK_SIZE = 16;
    public static readonly RENDER_DISTANCE = 7;
    public static readonly CANVAS_ID = "gameCanvas";
    // public static readonly INPUT_HANDLER = new InputHandler();
    public static readonly TIME_HANDLER = new TimeHandler();

    private static _inputHandler: InputHandler | null = null;

    public static get INPUT_HANDLER(): InputHandler {
        if (this._inputHandler === null) {
        this._inputHandler = new InputHandler();
        }
        return this._inputHandler;
    }

}