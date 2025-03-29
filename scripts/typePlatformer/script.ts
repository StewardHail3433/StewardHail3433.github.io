import { Camera } from "./camera/Camera.js";
import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Enity.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";
import { Constants } from "./utils/Constants.js";
import { WorldHandler } from "./world/WorldHandler.js";

declare const io: any;
class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private joinButton: HTMLButtonElement;
    private warningDiv: HTMLElement;

    private player: Player;
    private uiHandler: UIHandler;
    private camera: Camera;
    private worldHandler: WorldHandler;

    private players: Record<string, Entity> = {};
    private isMultiplayer: boolean = false;
    private socket: any = null;
    private lastTime: number = 0;

    constructor() {
        this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvas.width = Constants.CANVAS_WIDTH;
        this.canvas.height = Constants.CANVAS_HEIGHT;
        
        this.joinButton = document.getElementById("joinMultiplayer") as HTMLButtonElement;
        this.warningDiv = document.getElementById("test") as HTMLElement;
        
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 32, height: 32,
        }));
        this.camera = new Camera({ x: 100, y: 100, width: Constants.CANVAS_WIDTH, height: Constants.CANVAS_HEIGHT, zoom: 1.0});
        this.camera.trackEntity(this.player);

        this.uiHandler = new UIHandler(this.canvas, this.player, this.camera);
        this.worldHandler = new WorldHandler();
        this.setupEventListeners();
        requestAnimationFrame(this.gameLoop.bind(this));
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
            });
        
            this.socket.on("disconnect", () => {
                console.log("Disconnected from server. Returning to single-player mode.");
                this.isMultiplayer = false;
                this.joinButton.textContent = "Join Multiplayer";
            });
        
            this.socket.on("connect_error", () => {
                console.log("Multiplayer server not available.");
                this.isMultiplayer = false;
                this.joinButton.textContent = "Join Multiplayer";
            });
        });
    }

    private gameLoop(currentTime: number) {
        const dt = (currentTime - this.lastTime) / 1000; // Convert milliseconds to seconds
        this.lastTime = currentTime;

        this.update(dt);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(dt:number) {
        this.player.update(dt);
        this.camera.update();

        if (this.player.isMoving() && this.isMultiplayer && this.socket) {
            this.socket.emit("updatePlayer", this.player.serialize());
        }
        this.uiHandler.update();
    }

    private render() {
        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        
        this.ctx.save();  

        this.ctx.scale(this.camera.getView().zoom, this.camera.getView().zoom);
        this.ctx.translate(Math.round(-this.camera.getView().x), Math.round(-this.camera.getView().y));

        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH / this.camera.getView().zoom, Constants.CANVAS_HEIGHT / this.camera.getView().zoom);
        this.worldHandler.renderBackground(this.ctx, this.camera);
        this.player.render(this.ctx);

        if (this.isMultiplayer) {
            for (const id in this.players) {
                this.players[id].render(this.ctx);
            }
        }
        this.ctx.restore();

        this.uiHandler.render(this.ctx);
    }
}

new Game;