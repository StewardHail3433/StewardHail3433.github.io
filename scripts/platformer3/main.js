import UI from "./UI/ui.js";
import Player from "./entity/player.js";
import Map from "./map/map.js";
import Camera from "./camera/camera.js";
import { CONSTANTS } from "./utils/gameConst.js";
import Enemy from "./entity/enemy.js";

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
var enemies = []
var enemyCount = 10
for(let i = 0; i < enemyCount; i++) {
    enemies.push(new Enemy(ctx, map.map))
}
console.log(enemies)
// camera.setTarget(map.map[-1][0]);
camera.setTarget(player);


const FPS = 60;
const perfectFrameTime = 1000 / FPS;
let lastTimestamp = 0;



function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // deltaTime in seconds
    lastTimestamp = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);

}

function update(deltaTime) {
    for(let i = 0; i < enemyCount; i++) {
    enemies[i].update(deltaTime);}
    player.update(deltaTime, enemies);
    map.update();
    camera.update()
    ui.update();
}

function render() {
    
    
    //map.renderMini()

    
    ctx.save();  

    ctx.scale(CONSTANTS.canvasScale, CONSTANTS.canvasScale);
    ctx.translate(Math.round(-camera.pos.x), Math.round(-camera.pos.y));

    ctx.clearRect(0, 0, canvas.width / CONSTANTS.canvasScale, canvas.height / CONSTANTS.canvasScale);
    map.render();
    for(let i = 0; i < enemyCount; i++) {
    enemies[i].render();}
    player.render();
     //-camera.height/2)
    map.renderMini();
    // splayer.render();
    ctx.restore();
    
    

    ui.render();
}

document.getElementById("runButton").addEventListener("click", function () {
    lastTimestamp = performance.now();

    requestAnimationFrame(gameLoop);
    this.disabled = true;
})

canvas.addEventListener('keydown', function(e) {
    e.preventDefault()
    if (e.key === "p") {
        camera.setTarget(player);
    };
    if (e.key === "b") {
        camera.setTarget(map.map[199][0]);
    };
    map.keyDownInput(e.key)
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

