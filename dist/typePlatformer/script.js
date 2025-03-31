import { Camera } from "./camera/Camera.js";
import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Enity.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";
import { Constants } from "./utils/Constants.js";
import { WorldHandler } from "./world/WorldHandler.js";
class Game {
    constructor() {
        this.players = {};
        this.isMultiplayer = false;
        this.socket = null;
        this.lastTime = 0;
        this.isFullscreen = false;
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = Constants.CANVAS_WIDTH;
        this.canvas.height = Constants.CANVAS_HEIGHT;
        this.joinButton = document.getElementById("joinMultiplayer");
        this.warningDiv = document.getElementById("test");
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 32, height: 32,
        }));
        this.camera = new Camera({ x: 100, y: 100, width: Constants.CANVAS_WIDTH, height: Constants.CANVAS_HEIGHT, zoom: 1.0 });
        this.camera.trackEntity(this.player);
        this.uiHandler = new UIHandler(this.canvas, this.player, this.camera);
        this.worldHandler = new WorldHandler();
        this.setupEventListeners();
        requestAnimationFrame(this.gameLoop.bind(this));
        // Resize on window load and when resized
        this.resizeCanvasBound = this.resizeCanvas.bind(this);
        window.addEventListener("resize", this.resizeCanvasBound);
        document.addEventListener("keydown", (event) => { if (event.key === "?") {
            event.preventDefault();
            this.toggleFullScreen();
        } });
        document.getElementById("fullscreenButton").addEventListener("click", () => { this.toggleFullScreen(); });
    }
    toggleFullScreen() {
        if (!this.isFullscreen) {
            //https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
            //https://www.w3schools.com/howto/howto_js_fullscreen.asp
            if (document.getElementById("gameDiv").requestFullscreen) {
                document.getElementById("gameDiv").requestFullscreen().catch(err => {
                    console.error(`Error attempting fullscreen: ${err.message}`);
                    return;
                }).then(() => {
                    window.removeEventListener("resize", this.resizeCanvasBound);
                    this.dofullscreen();
                });
            }
            else if (document.getElementById("gameDiv").webkitRequestFullscreen) { /* Safari */
                document.getElementById("gameDiv").webkitRequestFullscreen();
                this.dofullscreen();
            }
            else if (document.getElementById("gameDiv").msRequestFullscreen) { /* IE11 */
                document.getElementById("gameDiv").msRequestFullscreen();
                this.dofullscreen();
            }
        }
        else {
            this.isFullscreen = false;
            this.canvas.style = "overflow: hidden;";
            this.resizeCanvasBound = this.resizeCanvas.bind(this);
            window.addEventListener("resize", this.resizeCanvasBound);
            document.exitFullscreen();
        }
    }
    dofullscreen() {
        window.removeEventListener("resize", this.resizeCanvasBound);
        this.isFullscreen = true;
        this.resizeCanvasBound();
    }
    resizeCanvas() {
        // AI I want to redo and learn more
        const container = document.getElementById("gameDiv");
        let scale = 1.0;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const baseWidth = Constants.CANVAS_WIDTH;
        const baseHeight = Constants.CANVAS_HEIGHT;
        const canvasAspect = baseWidth / baseHeight;
        const screenAspect = screenWidth / screenHeight;
        if (screenAspect > canvasAspect) {
            // Screen is wider than canvas aspect ratio, scale by height
            scale = screenHeight / baseHeight;
        }
        else {
            // Screen is taller than canvas aspect ratio, scale by width
            scale = screenWidth / baseWidth;
        }
        if (this.isFullscreen) {
            // Apply the calculated scale
            this.canvas.style.width = `${baseWidth * scale}px`;
            this.canvas.style.height = `${baseHeight * scale}px`;
            this.canvas.style.position = "absolute";
            this.canvas.style.left = `${(screenWidth - baseWidth * scale) / 2}px`;
            this.canvas.style.top = `${(screenHeight - baseHeight * scale) / 2}px`;
            this.uiHandler.updatePositions(scale);
        }
        else {
            // Reset to default size
            this.canvas.style.width = `${Constants.CANVAS_WIDTH}px`;
            this.canvas.style.height = `${Constants.CANVAS_HEIGHT}px`;
            this.canvas.style.position = "static";
            this.uiHandler.updatePositions(1);
            console.log("hbubu");
        }
    }
    setupEventListeners() {
        this.multiplayerEvents();
        document.getElementById("playerColor").addEventListener("input", (e) => {
            var hexValue = document.getElementById("playerColor").value.replace("#", "");
            this.player.getHitboxComponent().setColor({ hex: hexValue });
            if (this.isMultiplayer) {
                this.socket.emit("updatePlayer", this.player.serialize());
                this.warningDiv.textContent = "";
            }
        });
    }
    multiplayerEvents() {
        this.joinButton.addEventListener("click", () => {
            if (this.isMultiplayer)
                return;
            console.log("Attempting to join multiplayer...");
            this.socket = io("https://webserver-production-ec5c.up.railway.app");
            this.socket.on("connect", () => {
                console.log("Connected to multiplayer server!");
                this.isMultiplayer = true;
                this.joinButton.textContent = "Connected!";
                this.socket.emit("newPlayer", this.player.serialize());
                this.uiHandler.getChatHandler().setSocket(this.socket);
            });
            this.socket.on("updatePlayers", (data) => {
                this.players = {};
                for (const id in data) {
                    if (id !== this.socket.id) {
                        this.players[id] = Entity.deserialize(data[id]);
                    }
                }
            });
            this.socket.on("AFKWarning", (data) => {
                this.warningDiv.textContent = data.message;
                this.warningDiv.style.color = "red";
                setTimeout(() => {
                    this.warningDiv.style.color = "";
                }, 500);
            });
            this.socket.on("forceDisconnect", (data) => {
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
        });
    }
    gameLoop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000; // Convert milliseconds to seconds
        this.lastTime = currentTime;
        this.update(dt);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(dt) {
        this.player.update(dt);
        this.camera.update();
        if (this.player.isMoving() && this.isMultiplayer && this.socket) {
            this.socket.emit("updatePlayer", this.player.serialize());
        }
        this.uiHandler.update();
    }
    render() {
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
