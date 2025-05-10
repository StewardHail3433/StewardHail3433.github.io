import { Camera } from "./camera/Camera.js";
import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";
import { Constants } from "./utils/Constants.js";
import { WorldHandler } from "./world/WorldHandler.js";
import { CollisionHandler } from "./utils/CollisionHandler.js";
import { InteractionHandler } from "./utils/InteractionHandler.js";
import { InventoryHandler } from "./inventory/InventoryHandler.js";
import { Watcher } from "./entity/enemies/Watcher.js";
import { PathFinder } from "./utils/pathfinding/PathFinder.js";
class Game {
    constructor() {
        this.pathUpdateTime = 0;
        this.pathUpdateInterval = 0.5;
        this.lastTime = 0;
        this.isFullscreen = false;
        this.fullscreenhtml = [];
        this.canvas = document.getElementById(Constants.CANVAS_ID);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = Constants.CANVAS_WIDTH * window.devicePixelRatio * 3.25;
        this.canvas.height = Constants.CANVAS_HEIGHT * window.devicePixelRatio * 3.25;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.imageSmoothingQuality = "high";
        this.ctx.scale(window.devicePixelRatio * 3.25, window.devicePixelRatio * 3.25);
        this.joinButton = document.getElementById("joinMultiplayer");
        this.warningDiv = document.getElementById("test");
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 8, height: 8,
        }));
        this.enemies = [
            new Watcher(new HealthComponent(100, 100), new HitboxComponent({
                x: 50, y: 50, width: 10, height: 10
            })),
            new Watcher(new HealthComponent(100, 100), new HitboxComponent({
                x: 75, y: 50, width: 16, height: 16
            }))
        ];
        this.camera = new Camera({ x: 100, y: 100, width: Constants.CANVAS_WIDTH, height: Constants.CANVAS_HEIGHT, zoom: 1.35 }, "main");
        this.camera.trackEntity(this.player);
        this.worldHandler = new WorldHandler();
        this.uiHandler = new UIHandler(this.canvas, this.player, this.camera, this.worldHandler);
        this.setupEventListeners();
        requestAnimationFrame(this.gameLoop.bind(this));
        this.collisionHandler = new CollisionHandler();
        this.inventoryHandler = new InventoryHandler(this.canvas);
        this.interactionHandler = new InteractionHandler(this.player, this.worldHandler, this.camera, this.inventoryHandler);
        this.entities = this.enemies;
        this.entities.push(this.player);
        PathFinder.initNode();
        document.addEventListener("keydown", (event) => { if (event.key === "?") {
            event.preventDefault();
            this.toggleFullScreen();
        } if (event.key === "c") {
            this.collisionHandler.setPlayerCollisions(false);
        } if (event.key === "C") {
            this.collisionHandler.setPlayerCollisions(true);
        } });
        document.getElementById("fullscreenButton").addEventListener("click", () => { this.toggleFullScreen(); });
        Constants.COMMAND_SYSTEM.addCommand("fullscreen", () => this.toggleFullScreen());
    }
    toggleFullScreen() {
        if (!this.isFullscreen) {
            for (let i = 0; i < document.getElementsByClassName("hideFull").length; i++) {
                this.fullscreenhtml.push(document.getElementsByClassName("hideFull")[i].innerHTML);
                document.getElementsByClassName("hideFull")[i].innerHTML = "";
            }
            this.canvas.style.width = screen.availWidth + "px";
            this.canvas.style.height = screen.availHeight + "px";
            this.canvas.style.margin = "0px 0px 0px 0px";
            this.canvas.style.padding = "0px 0px 0px 0px";
        }
        else {
            this.canvas.style.width = Constants.CANVAS_WIDTH + "px";
            this.canvas.style.height = Constants.CANVAS_HEIGHT + "px";
            for (let i = 0; i < this.fullscreenhtml.length; i++) {
                document.getElementsByClassName("hideFull")[i].innerHTML = this.fullscreenhtml[i];
            }
            this.fullscreenhtml = [];
            document.getElementById("fullscreenButton").addEventListener("click", () => { this.toggleFullScreen(); });
        }
        this.isFullscreen = !this.isFullscreen;
    }
    setupEventListeners() {
        this.multiplayerEvents();
        document.getElementById("playerColor").addEventListener("input", (e) => {
            var hexValue = document.getElementById("playerColor").value.replace("#", "");
            this.player.getHitboxComponent().setColor({ hex: hexValue });
        });
    }
    multiplayerEvents() {
    }
    gameLoop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(dt);
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(dt) {
        this.player.update();
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
        this.collisionHandler.update(this.entities, this.worldHandler.getWorldMap(), dt);
        this.camera.update();
        this.worldHandler.update(this.camera);
        this.interactionHandler.update(dt);
        this.inventoryHandler.update();
        this.uiHandler.update();
        if (Constants.INPUT_HANDLER.wasJustLeftClicked()) {
            Constants.INPUT_HANDLER.setJustLeftClicked(false);
        }
        if (Constants.INPUT_HANDLER.wasJustRightClicked()) {
            Constants.INPUT_HANDLER.setJustRightClicked(false);
        }
        if (Constants.INPUT_HANDLER.wasJustMiddleClicked()) {
            Constants.INPUT_HANDLER.setJustMiddleClicked(false);
        }
        if (Constants.INPUT_HANDLER.getKeyToggled()["0"]) {
            this.camera.trackEntity(this.enemies[0]);
        }
        else {
            this.camera.trackEntity(this.player);
        }
        this.pathUpdateTime += dt;
        if (this.pathUpdateTime >= this.pathUpdateInterval) {
            this.pathUpdateTime = 0;
            PathFinder.setNodes(Math.floor(this.enemies[0].getHitboxComponent().getHitbox().x / Constants.TILE_SIZE), Math.floor(this.enemies[0].getHitboxComponent().getHitbox().y / Constants.TILE_SIZE), Math.floor(this.player.getHitboxComponent().getHitbox().x / Constants.TILE_SIZE), Math.floor(this.player.getHitboxComponent().getHitbox().y / Constants.TILE_SIZE), this.worldHandler.getWorldMap());
            const path = PathFinder.search();
            PathFinder.setNodes(Math.floor(this.enemies[1].getHitboxComponent().getHitbox().x / Constants.TILE_SIZE), Math.floor(this.enemies[1].getHitboxComponent().getHitbox().y / Constants.TILE_SIZE), Math.floor(this.player.getHitboxComponent().getHitbox().x / Constants.TILE_SIZE), Math.floor(this.player.getHitboxComponent().getHitbox().y / Constants.TILE_SIZE), this.worldHandler.getWorldMap());
            const path2 = PathFinder.search();
            this.enemies[0].setPath(path);
            this.enemies[1].setPath(path2);
        }
    }
    render() {
        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
        this.ctx.save();
        this.ctx.scale(this.camera.getView().zoom, this.camera.getView().zoom);
        this.ctx.translate(-this.camera.getView().x, -this.camera.getView().y);
        this.ctx.clearRect(0, 0, Constants.CANVAS_WIDTH / this.camera.getView().zoom, Constants.CANVAS_HEIGHT / this.camera.getView().zoom);
        this.worldHandler.renderBackground(this.ctx, this.camera);
        for (let i = 0; i < this.player.getLayer() + 1; i++) {
            this.worldHandler.renderLayer(i, this.ctx, this.camera);
        }
        this.worldHandler.renderDropItems(this.ctx, this.camera);
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render(this.ctx);
        }
        this.player.render(this.ctx);
        PathFinder.render(this.enemies[0].getPath(), this.ctx);
        PathFinder.render(this.enemies[1].getPath(), this.ctx);
        for (let i = this.player.getLayer() + 1; i < 2; i++) {
            this.worldHandler.renderLayer(i, this.ctx, this.camera);
        }
        this.worldHandler.renderMouse(this.ctx, this.camera);
        this.ctx.restore();
        this.inventoryHandler.render(this.ctx);
        this.uiHandler.render(this.ctx);
    }
}
new Game;
