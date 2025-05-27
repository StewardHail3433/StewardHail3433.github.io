import { Camera } from "./camera/Camera.js";
import { HealthComponent } from "./components/HealthComponent.js";
import { HitboxComponent } from "./components/HitboxComponent.js";
import { Entity } from "./entity/Entity.js";
import { Player } from "./entity/player/Player.js";
import { UIHandler } from "./ui/UIHandler.js";
import { Constants } from "./utils/Constants.js";
import { WorldHandler } from "./world/WorldHandler.js";
import { CollisionHandler } from "./utils/CollisionHandler.js";
import { InteractionHandler } from "./utils/InteractionHandler.js";
import { InventoryHandler } from "./inventory/InventoryHandler.js";
import { Watcher } from "./entity/enemies/Watcher.js"
import { PathFinder } from "./utils/pathfinding/PathFinder.js";
import { ImageLoader } from "./utils/ImageLoader.js";
import { Tiles } from "./world/Tiles.js";
import { Items } from "./item/Items.js";
import { AudioHandler, MUSIC } from "./utils/audio/AudioHandler.js";

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private player: Player;
    private enemies: Entity[];
    private entities: Entity[];
    private unusedEntities: Entity[];
    private uiHandler: UIHandler;
    private camera: Camera;
    private worldHandler: WorldHandler;
    private collisionHandler: CollisionHandler;
    private interactionHandler: InteractionHandler;
    private inventoryHandler: InventoryHandler;

    private pathUpdateTime = 0;
    private pathUpdateInterval = 0.5; 

    private lastTime: number = 0;
    private isFullscreen: boolean =false;
    private fullscreenhtml: string[] = [];
    private renderPath = false;

    constructor() {
        this.canvas = document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.canvas.width = Constants.CANVAS_WIDTH * window.devicePixelRatio*3.25;
        this.canvas.height = Constants.CANVAS_HEIGHT * window.devicePixelRatio*3.25;
        
        this.ctx.imageSmoothingEnabled =false;
        this.ctx.imageSmoothingQuality = "high";
        this.ctx.scale(window.devicePixelRatio*3.25, window.devicePixelRatio*3.25);
        
        this.player = new Player("TIm", new HealthComponent(100, 100), new HitboxComponent({
            x: 100, y: 100, width: 8, height: 12,
        }));
        this.enemies = [
            new Watcher(new HealthComponent(100, 100), new HitboxComponent({
                x: 50, y: 50, width: 10, height: 10
            })),
            new Watcher(new HealthComponent(100, 100), new HitboxComponent({
                x: 75, y: 50, width: 16, height: 16
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

        this.entities = this.enemies;
        this.entities.push(this.player);
        this.unusedEntities = [];
        PathFinder.initNode();
        // AudioHandler.init();
        
        document.addEventListener("keydown", (event) => {if(event.key === "?"){event.preventDefault();this.toggleFullScreen()} if(event.key === "c") {this.collisionHandler.setPlayerCollisions(false)} if(event.key === "C") {this.collisionHandler.setPlayerCollisions(true)}});
        document.getElementById("fullscreenButton")!.addEventListener("click", () => {this.toggleFullScreen()});

        Constants.COMMAND_SYSTEM.addCommand("fullscreen", () =>this.toggleFullScreen());

        Constants.COMMAND_SYSTEM.addCommand("renderPath", () =>this.renderPath = !this.renderPath);
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

    }

    private setupEventListeners() {
        this.multiplayerEvents();
        (document.getElementById("playerColor") as HTMLInputElement).addEventListener("input", (e) => {
            var hexValue = (document.getElementById("playerColor") as HTMLInputElement).value.replace("#","");
            
            this.player.getHitboxComponent().setColor({hex: hexValue});

        });

    }

    private multiplayerEvents() {
        
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

        this.collisionHandler.update(this.entities, this.unusedEntities, this.worldHandler.getWorldMap(), dt);

        this.camera.update();
        
        this.worldHandler.update(this.camera);
        this.interactionHandler.update(dt);
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

        if(Constants.INPUT_HANDLER.getKeyToggled()["0"]) {
            this.camera.trackEntity(this.enemies[0]);
        } else {
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
            // this.enemies[1].setPath(path2); 
        }

        Constants.TIME_HANDLER.addTime(dt);
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
        if(this.renderPath) {
            PathFinder.render((this.enemies[0] as Watcher).getPath(), this.ctx);
            PathFinder.render((this.enemies[1] as Watcher).getPath(), this.ctx);
        }
        for(let i = this.player.getLayer()+1; i < 2; i++) {
            this.worldHandler.renderLayer(i, this.ctx, this.camera);
        }

        this.worldHandler.renderMouse(this.ctx, this.camera)

        this.ctx.restore();

        this.inventoryHandler.render(this.ctx);
        this.uiHandler.render(this.ctx);
        this.ctx.fillStyle = "black"
        this.ctx.font = 20 + "px serif";
        this.ctx.fillText(Constants.TIME_HANDLER.getTime() + " ", Constants.CANVAS_WIDTH / 2, 10);
    }
}


(async () => {
    await ImageLoader.loadAllImages();
    Tiles.loadTilesImgs();
    Items.loadItemsImgs();
    await AudioHandler.loadAllSounds();
    if(Math.random() * 2 < 1) {
        AudioHandler.getSounds()[MUSIC.MUSIC0]?.loop(true).play()
    } else {
        AudioHandler.getSounds()[MUSIC.LIVING]?.loop(true).play()
    }
    new Game();
})()




    