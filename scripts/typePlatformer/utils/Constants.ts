import { CommandSystem } from "./CommandSystem.js";

export class Constants {
    public static readonly CANVAS_WIDTH = 480;
    public static readonly CANVAS_HEIGHT = 320;
    public static readonly TILE_SIZE = 16;
    public static readonly WORLD_WIDTH = 500;
    public static readonly WORLD_HEIGHT = 500;
    public static readonly COMMAND_SYSTEM = new CommandSystem();
}