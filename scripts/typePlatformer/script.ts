import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Enity.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";

declare const io: any;
class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private joinButton: HTMLButtonElement;
    private warningDiv: HTMLElement;

    private player: Player;
    private uiHandler: UIHandler;

    private players: Record<string, Entity> = {};
    private isMultiplayer: boolean = false;
    private socket: any = null;
    private lastTime: number = 0;

    constructor() {
        this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvas.width = 480;
        this.canvas.height = 320;
        
        this.joinButton = document.getElementById("joinMultiplayer") as HTMLButtonElement;
        this.warningDiv = document.getElementById("test") as HTMLElement;
        
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 32, height: 32,
        }));
        this.uiHandler = new UIHandler(this.canvas);

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

        if (this.player.isMoving() && this.isMultiplayer && this.socket) {
            this.socket.emit("updatePlayer", this.player.serialize());
        }
        this.uiHandler.update(this.player);
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        this.player.render(this.ctx);

        if (this.isMultiplayer) {
            for (const id in this.players) {
                this.players[id].render(this.ctx);
            }
        }
        this.uiHandler.render(this.ctx);
    }
}

new Game;