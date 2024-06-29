import UI from "./ui/ui.js";
import Player from "./entity/player.js";
import Map from "./map/map.js";
import Camera from "./camera/camera.js";
import { CONSTANTS } from "./utils/gameConst.js";
import SimpleEnemy from "./entity/enemy/simpleEnemy.js";
import ShooterEnemy from "./entity/enemy/shooterEnemy.js";
import CanonEnemy from "./entity/enemy/canonEnemy.js";
import Sound from "./sound/sound.js";

const canvas = document.getElementById('gameCanvas');
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

ctx.canvas.width = screen.availWidth * .8;
ctx.canvas.height = screen.availHeight * .7;

var sound = new Sound();

ctx.canvas.style = "background-color: black;"

var state = "play";

var camera = new Camera(ctx);
var map = new Map(ctx, camera);

var player = new Player(ctx, map.map);

var enemies = []
for(let i = 0; i < 10; i++) {
    enemies.push(new SimpleEnemy(ctx, map.map,camera, player, sound, i))
}

enemies.push(new CanonEnemy(ctx, map.map,camera,player,{x: 1237, y:470}, sound, enemies.length))
enemies.push(new ShooterEnemy(ctx, map.map,camera,player,{x: 1237, y:470}, sound, enemies.length))

var ui = new UI(ctx, player, camera, enemies, state, sound);
// camera.setTarget(map.map[-1][0]);
camera.setTarget(player);


const FPS = 60;
const perfectFrameTime = 1000 / FPS;
let elapsedTime = 0; 
let lastTimestamp = 0;


function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // deltaTime in seconds
    lastTimestamp = timestamp;
    
        update(deltaTime);
        render();
    

    requestAnimationFrame(gameLoop);

}

function update(deltaTime) {
    if(state == "play") {
        if (player.alive ) {
            elapsedTime += deltaTime;
            for(let i = 0; i < enemies.length; i++) {
                enemies[i].update(deltaTime, elapsedTime);
                if(enemies[i].shouldDelete) {enemies.splice(i, 1);}
            }
            player.update(deltaTime, enemies);  

            map.update();
            camera.update();
        }
    }
    ui.update(state);

    if (!player.alive || state == "pause") { 
        sound.stop("music")
    } else {
        if(0 != sound.getCurrentMusic()) {
            sound.play("music", 0);
        }
    }
}

function render() {
    
    
    //map.renderMini()

    
    ctx.save();  

    ctx.scale(CONSTANTS.canvasScale, CONSTANTS.canvasScale);
    ctx.translate(Math.round(-camera.pos.x), Math.round(-camera.pos.y));

    ctx.clearRect(0, 0, canvas.width / CONSTANTS.canvasScale, canvas.height / CONSTANTS.canvasScale);
    map.render();
    for(let i = 0; i < enemies.length; i++) {
    enemies[i].render();}
    player.render();
     //-camera.height/2)
    map.renderMini();
    // splayer.render();
    ctx.restore();
    
    

    ui.render();
    renderTimer();
}

function renderTimer() {
    const seconds = Math.floor(elapsedTime);

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("Time: " + seconds.toString().padStart(2, '0'), 10, 30);
    ctx.restore();
}


document.getElementById("runButton").addEventListener("click", function () {
    lastTimestamp = performance.now();
    sound.play("music", 0);

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
    if (e.key === "Escape") {
        if( state === "play") {
            state = "pause";
        } else {
            state = "play";
            ui.pauseState = "none";
        }
    }
    map.keyDownInput(e.key)
    player.keyDownInput(e.key);
    ui.keyDownInput(e.key);
});

canvas.addEventListener('keyup', function(e) {
    e.preventDefault();
    player.keyUpInput(e.key);
    for(let i = 0; i < enemies.length; i++) {
        if(enemies[i].projectileEnemy) {
            enemies[i].keyUpInput(e.key);}
        }
});

canvas.addEventListener('click', function(e) {
    e.preventDefault();
    ui.onClickInput(e);
    if(ui.pauseState == "change to play") {
        state = "play";
    }
}, false);

