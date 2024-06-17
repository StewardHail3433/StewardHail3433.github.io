import Player from "./entity/player.js";
import UI from "./UI/ui.js";

const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');

ctx.canvas.width = screen.availWidth * .8;
ctx.canvas.height = screen.availHeight * .7;

var player = new Player(ctx);
var ui = new UI(ctx, player);

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
        
        accumulatedTime -= fixedTimeStep;
    }

    update(deltaTime);
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
    player.update(deltaTime);
    ui.update();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.render();
    ui.render()
}

document.getElementById("runButton").addEventListener("click", function () {
    requestAnimationFrame(gameLoop);
    this.disabled = true;
})

canvas.addEventListener('keydown', function(e) {
    e.preventDefault();
    player.keyDownInput(e.key);
    ui.keyDownInput(e.key);
});

canvas.addEventListener('keyup', function(e) {
    e.preventDefault();
    player.keyUpInput(e.key);
});

canvas.addEventListener('click', function(e) {
    e.preventDefault();
    ui.onClickInput(e);
}, false);

