
import CollisionChecker from "./collisionChecker.js";
import Entity from "./entity/entity.js";
import Player from "./entity/player.js";
import Map from "./map/map.js";

const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');

ctx.canvas.width = screen.availWidth * .8;
ctx.canvas.height = screen.availHeight * .7;

let player = new Player(50, 50, 20, 20, 0.3, 0.01, ctx);
let ent = new Entity(50, 50, 20, 20, 0.3, 0.005, ctx);

let map = new Map(ctx);
let collisionChecker = new CollisionChecker();

const FPS = 60;
const fixedTimeStep = 1000 / FPS;

let lastFrameTime = 0;
let accumulatedTime = 0;

let frameCount = 0;
let fps = 0;
let lastFpsUpdate = 0;
const fpsUpdateInterval = 1000; 

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    accumulatedTime += deltaTime;

    while (accumulatedTime >= fixedTimeStep) {
        update(deltaTime);
        accumulatedTime -= fixedTimeStep;
    }

    render();

    requestAnimationFrame(gameLoop);

    frameCount++;
    if (timestamp - lastFpsUpdate >= fpsUpdateInterval) {
        fps = (frameCount * 1000) / (timestamp - lastFpsUpdate);
        console.log(`FPS: ${fps.toFixed(2)}`);
        lastFpsUpdate = timestamp;
        frameCount = 0;
    }

}

function update(deltaTime) {
    collisionChecker.entitiyTileCollision(player, map.map)
    ent.update(deltaTime);
    player.update(deltaTime);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.render();
    ent.render();
    player.render();
}

document.getElementById("runButton").addEventListener("click", function () {
    requestAnimationFrame(gameLoop);
    this.disabled = true;
})

canvas.addEventListener('keydown', function(e) {
    player.keyDownInput(e.key);
    console.log(e.key);
});

canvas.addEventListener('keyup', function(e) {
    player.keyUpInput(e.key);
    console.log("end: " +e.key);
});
