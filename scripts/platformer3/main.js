import UI from "./UI/ui.js";
import Player from "./entity/player.js";
import Map from "./map/map.js";
import Camera from "./camera/camera.js";
import { CONSTANTS } from "./utils/gameConst.js";

const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;


ctx.canvas.width = screen.availWidth * .8;
ctx.canvas.height = screen.availHeight * .7;

ctx.canvas.style = "background-color: black;"

var camera = new Camera(ctx);
var map = new Map(ctx, camera);
var player = new Player(ctx, map.map);
var ui = new UI(ctx, player, camera);

camera.setTarget(player);



const FPS = 60;
const perfectFrameTime = 1000 / FPS;
let lastTimestamp = 0;



function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);

}

function update(deltaTime) {
    player.update(deltaTime);
    map.update();
    camera.update()
    ui.update();
}

function render() {
    ctx.save();  

    ctx.scale(CONSTANTS.scale, CONSTANTS.scale);
    ctx.translate(Math.round(-camera.pos.x), Math.round(-camera.pos.y));

    ctx.clearRect(0, 0, canvas.width / CONSTANTS.scale, canvas.height / CONSTANTS.scale);

    map.render();
    
    player.render();
    

    ctx.restore();
    ui.render();
}

document.getElementById("runButton").addEventListener("click", function () {
    lastTimestamp = performance.now();
    
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

