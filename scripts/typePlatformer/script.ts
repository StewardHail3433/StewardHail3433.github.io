import { error } from "console";
import { Camera } from "./camera/Camera.js";
import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Entity.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";
import { CommandSystem } from "./utils/CommandSystem.js";
import { Constants } from "./utils/Constants.js";
import { WorldHandler } from "./world/WorldHandler.js";
import { Tile } from "./world/Tile.js";
import { ImageLoader } from "./utils/ImageLoader.js";
import { CollisionHandler } from "./utils/CollisionHandler.js";
import { InteractionHandler } from "./utils/InteractionHandler.js";
import { Inventory } from "./inventory/Inventory.js";
import { InventoryHandler } from "./inventory/InventoryHandler.js";
import { Watcher } from "./entity/enemies/Watcher.js"

declare const io: any;
class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private joinButton: HTMLButtonElement;
    private warningDiv: HTMLElement;

    private player: Player;
    private enemies: Entity[];
    private uiHandler: UIHandler;
    private camera: Camera;
    private worldHandler: WorldHandler;
    private collisionHandler: CollisionHandler;
    private interactionHandler: InteractionHandler;
    private inventoryHandler: InventoryHandler;

    private players: Record<string, Entity> = {};
    private isMultiplayer: boolean = false;
    private socket: any = null;
    private lastTime: number = 0;
    private isFullscreen: boolean =false;
    private fullscreenhtml: string[] = [];

    constructor() {
        this.canvas = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvas.width = Constants.CANVAS_WIDTH * window.devicePixelRatio*3.25;
        this.canvas.height = Constants.CANVAS_HEIGHT * window.devicePixelRatio*3.25;
        
        this.ctx.imageSmoothingEnabled =false;
        this.ctx.imageSmoothingQuality = "high";
        this.ctx.scale(window.devicePixelRatio*3.25, window.devicePixelRatio*3.25);
        this.joinButton = document.getElementById("joinMultiplayer") as HTMLButtonElement;
        this.warningDiv = document.getElementById("test") as HTMLElement;
        
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 8, height: 8,
        }));
        this.enemies = [
            new Watcher(new HealthComponent(100, 100), new HitboxComponent({
                x: 50, y: 50, width: 10, height: 10
            }))
        ]
        this.camera = new Camera({ x: 100, y: 100, width: Constants.CANVAS_WIDTH, height: Constants.CANVAS_HEIGHT, zoom: 1.35}, "main");
        this.camera.trackEntity(this.player);

        this.worldHandler = new WorldHandler();
        this.uiHandler = new UIHandler(this.canvas, this.player, this.camera, this.worldHandler);
        this.setupEventListeners();
        requestAnimationFrame(this.gameLoop.bind(this));

        this.collisionHandler = new CollisionHandler();

        this.inventoryHandler = new InventoryHandler(this.canvas);
        this.interactionHandler = new InteractionHandler(this.player, this.worldHandler, this.camera, this.inventoryHandler);
        
        document.addEventListener("keydown", (event) => {if(event.key === "?"){event.preventDefault();this.toggleFullScreen()} if(event.key === "c") {this.collisionHandler.setPlayerCollisions(false)} if(event.key === "C") {this.collisionHandler.setPlayerCollisions(true)}});
        document.getElementById("fullscreenButton")!.addEventListener("click", () => {this.toggleFullScreen()});

        Constants.COMMAND_SYSTEM.addCommand("fullscreen", () =>this.toggleFullScreen());

    }

    private toggleFullScreen() {
        if(!this.isFullscreen) {
            
            for(let i = 0; i < document.getElementsByClassName("hideFull").length; i++) {
                this.fullscreenhtml.push(document.getElementsByClassName("hideFull")[i].innerHTML);
                document.getElementsByClassName("hideFull")[i].innerHTML = "";
            }
            this.canvas.style.width = screen.availWidth + "px";
            this.canvas.style.height = screen.availHeight + "px";
            this.canvas.style.margin = "0px 0px 0px 0px";
            this.canvas.style.padding = "0px 0px 0px 0px";
        } else {
            this.canvas.style.width = Constants.CANVAS_WIDTH + "px";
            this.canvas.style.height = Constants.CANVAS_HEIGHT + "px";
            for(let i = 0; i < this.fullscreenhtml.length; i++) {
                document.getElementsByClassName("hideFull")[i].innerHTML = this.fullscreenhtml[i];
            }
            this.fullscreenhtml = []
            document.getElementById("fullscreenButton")!.addEventListener("click", () => {this.toggleFullScreen()});
        }
        this.isFullscreen = !this.isFullscreen;

        // const entities = this.enemies;
        // entities.push(this.player);
    }

    private setupEventListeners() {
        this.multiplayerEvents();
        (document.getElementById("playerColor") as HTMLInputElement).addEventListener("input", (e) => {
            var hexValue = (document.getElementById("playerColor") as HTMLInputElement).value.replace("#","");
            
            this.player.getHitboxComponent().setColor({hex: hexValue});
            if(this.isMultiplayer) {
                this.socket.emit("updatePlayer", this.player.serialize());
                this.warningDiv.textContent = "";
            }
        });

    }

    private multiplayerEvents() {
        this.joinButton.addEventListener("click", () => {
            if (this.isMultiplayer) return;
        
            console.log("Attempting to join multiplayer...");
            this.socket = io("https://webserver-production-ec5c.up.railway.app");
        
            this.socket.on("connect", () => {
                console.log("Connected to multiplayer server!");
                this.isMultiplayer = true;
                this.joinButton.textContent = "Connected!";
                this.socket.emit("newPlayer", this.player.serialize());
                this.uiHandler.getChatHandler().setSocket(this.socket);
            });
        
            this.socket.on("updatePlayers", (data: Record<string, any>) => {
                this.players = {};
                for (const id in data) {
                    if (id !== this.socket.id) {
                        this.players[id] = Entity.deserialize(data[id]);
                    }
                }
            });
        
            this.socket.on("AFKWarning", (data: any) => {
                this.warningDiv.textContent = data.message;
                this.warningDiv.style.color = "red"; 
        
                setTimeout(() => {
                    this.warningDiv.style.color = "";
                }, 500);
        
            });
        
            this.socket.on("forceDisconnect", (data: any) => {
                this.socket.disconnect();
                alert(data.message);
                this.warningDiv.textContent = "";
                this.uiHandler.getChatHandler().setSocket(null);
            });
        
            this.socket.on("disconnect", () => {
                console.log("Disconnected from server. Returning to single-player mode.");
                this.isMultiplayer = false;
                this.joinButton.textContent = "Join Multiplayer";
                this.uiHandler.getChatHandler().setSocket(null);
            });
        
            this.socket.on("connect_error", () => {
                console.log("Multiplayer server not available.");
                this.isMultiplayer = false;
                this.joinButton.textContent = "Join Multiplayer";
                this.uiHandler.getChatHandler().setSocket(null);
            });

            this.socket.on("initNewWorld", (data: any) => {
                // const deserializedChunks = new Map<string, Tile[][]>();
            
                // for (const key in data) {
                //     const tileMatrix = data[key];
            
                //     if (Array.isArray(tileMatrix)) {
                //         const chunk: Tile[][] = tileMatrix.map((row: any[]) =>
                //             row.map((tileData: any) => Tile.deserialize(tileData))
                //         );
                //         deserializedChunks.set(key, chunk);
                //     }
                // }
            
                // this.worldHandler.loadChunksFromServer(deserializedChunks);
            });
            

            this.socket.on("loadChunks", (data: any) => {

                // so from my understanding the data was record in server and then a json object to send and then cnoverted to map here and this stop the crashing because the JSON.stringify can do the record with eaiser tha map so no crashing so server end
                // const deserializedChunks = new Map<string, Tile[][]>();
            
                // for (const key in data) {
                //     const tileMatrix = data[key];
            
                //     if (Array.isArray(tileMatrix)) {
                //         const chunk: Tile[][] = tileMatrix.map((row: any[]) =>
                //             row.map((tileData: any) => Tile.deserialize(tileData))
                //         );
                //         deserializedChunks.set(key, chunk);
                //     }
                // }
            
                // this.worldHandler.loadChunksFromServer(deserializedChunks);
            });

            
        });
        Constants.COMMAND_SYSTEM.addCommand("server", (args: string[]) => {
            if(args.length > 0) {
                if(args[0] == "reloadWorld") {
                    if(this.socket) {
                        if(args.length >= 2) {
                            if(args[1] == "seed") {
                                if(isNaN(parseFloat(args[2]))) {
                                    this.socket.emit("loadWorld", {seed: parseFloat(args[2])});
                                } 
                            } else {
                                Constants.COMMAND_SYSTEM.outputArgsError("/server reloadWorld seed? ###?")
                            }
                        } else {
                            this.socket.emit("loadWorld", {seed:-1});
                        }
                    }
                    else {
                        Constants.COMMAND_SYSTEM.outputCustomError("/server reloadWorld seed? ###?", "Not connected to a server")
                    }
                }
            } else {
                Constants.COMMAND_SYSTEM.outputArgsError("/server reloadWorld seed? ###?")
            }
        });
    }

    private gameLoop(currentTime: number) {
        const dt = (currentTime - this.lastTime) / 1000; 
        this.lastTime = currentTime;

        this.update(dt);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(dt:number) {
        this.player.update();
        for(let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }

        this.collisionHandler.update([this.player], this.worldHandler.getWorldMap(), dt);

        this.camera.update();
        
        if(this.isMultiplayer && this.socket) {
            this.worldHandler.updateServer(this.camera, this.socket);
        } else {
            this.worldHandler.update(this.camera);
        }
        this.interactionHandler.update(dt);
        if (this.player.isMoving() && this.isMultiplayer && this.socket) {
            this.socket.emit("updatePlayer", this.player.serialize());
        }
        this.inventoryHandler.update();
        this.uiHandler.update();

        if(Constants.INPUT_HANDLER.wasJustLeftClicked()) {
            Constants.INPUT_HANDLER.setJustLeftClicked(false);
        }

        if(Constants.INPUT_HANDLER.wasJustRightClicked()) {
            Constants.INPUT_HANDLER.setJustRightClicked(false);
        }

        if(Constants.INPUT_HANDLER.wasJustMiddleClicked()) {
            Constants.INPUT_HANDLER.setJustMiddleClicked(false);
        }
    }

    private render() {
        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        
        this.ctx.save();  

        this.ctx.scale(this.camera.getView().zoom, this.camera.getView().zoom);
        this.ctx.translate(-this.camera.getView().x, -this.camera.getView().y);

        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH / this.camera.getView().zoom, Constants.CANVAS_HEIGHT / this.camera.getView().zoom);
        this.worldHandler.renderBackground(this.ctx, this.camera);
        for(let i = 0; i < this.player.getLayer()+1; i++) {
            this.worldHandler.renderLayer(i, this.ctx, this.camera);
        }
        this.worldHandler.renderDropItems(this.ctx, this.camera);
        for(let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this.ctx);
        }
        this.player.render(this.ctx);
        for(let i = this.player.getLayer()+1; i < 2; i++) {
            this.worldHandler.renderLayer(i, this.ctx, this.camera);
        }

        this.worldHandler.renderMouse(this.ctx, this.camera)

        if (this.isMultiplayer) {
            for (const id in this.players) {
                this.players[id].render(this.ctx);
            }
        }
        this.ctx.restore();

        this.inventoryHandler.render(this.ctx);
        this.uiHandler.render(this.ctx);
    }
}

new Game;