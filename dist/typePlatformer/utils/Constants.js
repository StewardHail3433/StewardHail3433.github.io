import { CommandSystem } from "./CommandSystem.js";
import { InputHandler } from "./InputHandler.js";
export class Constants {
}
Constants.CANVAS_WIDTH = 640;
Constants.CANVAS_HEIGHT = 360;
Constants.TILE_SIZE = 16;
Constants.WORLD_WIDTH = 50;
Constants.WORLD_HEIGHT = 50;
Constants.COMMAND_SYSTEM = new CommandSystem();
Constants.CHUNK_SIZE = 16;
Constants.RENDER_DISTANCE = 3;
Constants.CANVAS_ID = "gameCanvas";
Constants.INPUT_HANDLER = new InputHandler();
