import { CommandSystem } from "./CommandSystem.js";

export class Constants {
    public static readonly CANVAS_WIDTH = 480;
    public static readonly CANVAS_HEIGHT = 320;
    public static readonly TILE_SIZE = 16;
    public static readonly WORLD_WIDTH = 50;
    public static readonly WORLD_HEIGHT = 50;
    public static readonly COMMAND_SYSTEM = new CommandSystem();
    public static readonly CHUNK_SIZE = 12;
    public static readonly RENDER_DISTANCE = 3;
}