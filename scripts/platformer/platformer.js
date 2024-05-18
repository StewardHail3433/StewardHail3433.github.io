import Button from "./button.js";
import Player from "./player.js";
import Map from "./map.js"
import collisionChecker from "./collisionChecker.js";


const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");

var map = new Map(ctx);

if (screen.availWidth > screen.availHeight) {
    ctx.canvas.width = screen.availWidth * .8;
    ctx.canvas.height = screen.availHeight * .7;
    //document.getElementById("test").innerHTML = "<p>" +screen.availWidth + ", " + screen.availHeight + "<br>"+ctx.canvas.width + ", " + ctx.canvas.height +"</p>" ;
} else {
    ctx.canvas.width = screen.width;
    ctx.canvas.height = screen.height;
    //document.getElementById("test").innerHTML = "<p>" +screen.availWidth + ", " + screen.availHeight + "<br>"+screen.width + ", " + screen.height +"</p>" ;
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

var mouseFocus = false;

var cChecker = new collisionChecker;
//entity
var player = new Player(ctx);

document.getElementById("test").innerHTML = "<p>" + ctx.canvas.height + "</p>";

/** @type {Button} */var buttons;
function buttonUpdate(deltaTime) {
    for(let button of buttons) {
        if (button.isPressed() && button.isInputDown() && mouseFocus == true) {
            button.setColor("green");
            if(button.getName() == "left") {
                player.moveLeft();
                console.log("LeftStart");
            }
            if(button.getName() == "right") {
                player.moveRight();
                console.log("rightStart");
            }
            if(button.getName() == "jump") {
                player.moveJump();
            }
        } else if(mouseFocus) {
            button.setColor("red");
            if(button.getName() == "left") {
                player.moveLeftStop();
                console.log("LeftStop");
            }
            if(button.getName() == "right") {
                player.moveRightStop();
                console.log("RightStop");
            }
        }
    }
}

function update(deltaTime) {
    if(player.moveMapLeft) {
        map.update("left", player.xVel, deltaTime);
    } else if(player.moveMapRight) {
        map.update("right", player.xVel, deltaTime);
    } else{
        map.update("none", player.xVel, deltaTime);
    }
    
    player.update(map.map, deltaTime);
    for(let i = 0; i < map.map.length; i++) {
        for(let j = 0; j < map.map[i].length; j++) {
            let dir = cChecker.collisionPlayerBlock(player, map.map[i][j]);
            if (dir === "left" || dir === "right") {
                if (!player.isAtMiddle) {
                    player.xVel = 0;
                    if (dir === "left") {
                        player.x = map.map[i][j].x + map.map[i][j].width;
                    } else if (dir === "right") {
                        player.x = map.map[i][j].x - player.width;
                    }
                } else {
                    if (dir === "right") {
                    player.moveMapLeft = false;
                    console.log("hi");}
                    if (dir === "left") {
                    player.moveMapRight = false;
                    console.log("hi2")}
                }
            } else if (dir === "up" || dir === "down") {
                player.yVel = 0;
                if (dir === "up") {
                    player.y = map.map[i][j].y + map.map[i][j].height;
                } else if (dir === "down") {
                    player.y = map.map[i][j].y - player.height;
                }
            }


        }
    }
    
    //if(isTouchDevice()) {
        buttonUpdate(deltaTime);
    //}
}

const fixedTimeStep = 1000/60; // 60 frames per second

let lastFrameTime = 0;
let accumulatedTime = 0;

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
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw();
    player.draw();
    for(let button of buttons) {
        button.draw(ctx);
    }
}

function touchStart(event) {
    for (let button of buttons) {
        button.touchButton(event, canvas);
        if (button.isPressed()) {
            button.setInputDown(true);
        }
    }
    event.preventDefault();
}

function touchMove(event) {
    for (let button of buttons) {
        if (button.isInputDown()) {
            button.touchButton(event, canvas);
        }
    }
    event.preventDefault();
}

function touchEnd(event) {
    for (let button of buttons) {
        button.touchButton(event, canvas);
        if (!button.isPressed()) {
            button.setInputDown(false);
        }
    }
    event.preventDefault();
}


function mouseDown(event) {
    mouseFocus = true;
    for(let button of buttons) {
        button.mouseButton(event, canvas);
        event.preventDefault();
        document.getElementById("test2").innerText = document.getElementById("test2").innerText + " start";
        button.setInputDown(true);
    }
}
function mouseMove(event) {
    for(let button of buttons) {
        if(button.isInputDown()) {
            button.mouseButton(event, canvas); 
            event.preventDefault(); 
            document.getElementById("test2").innerText = document.getElementById("test2").innerText + " mid";
        }
        event.preventDefault();
    }
}
function mouseUp(event) {
    for(let button of buttons) {
        if(button.isInputDown()) {
            button.mouseButton(event, canvas); 
            event.preventDefault(); 
            document.getElementById("test2").innerText = document.getElementById("test2").innerText + " end1";
            button.setInputDown(false);
        }
    }
}

runButton.addEventListener("click", function () {
    if (isTouchDevice()) {
        buttons = [new Button(canvas, 10, 10, 40, 40, "red", "left"), new Button(canvas, 70, 10, 40, 40, "red", "right"), new Button(canvas, 10, 70, 40, 40, "red", "jump")];
        canvas.addEventListener("touchstart", function (event) {touchStart(event)}, { passive: false });
        canvas.addEventListener("touchmove", function (event) {touchMove(event)}, { passive: false });
        canvas.addEventListener("touchend", function (event) {touchEnd(event)}, { passive: false });
    } else {
        buttons = [new Button(canvas, 10, 10, 40, 40, "red", "left"), new Button(canvas, 70, 10, 40, 40, "red", "right"), new Button(canvas, 10, 70, 40, 40, "red", "jump")];
        canvas.addEventListener("mousedown", function (event) {mouseDown(event)}, { passive: false });
        canvas.addEventListener("mousemove", function (event) {mouseMove(event)}, { passive: false });
        canvas.addEventListener("mouseup", function (event) {mouseUp(event)}, { passive: false });
    }
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Start the game loop
    requestAnimationFrame(gameLoop);

    this.disable = true;
})

function keyDownHandler(e) {
    mouseFocus = false;
    if (e.key === " " || e.key === "w") {
        player.moveJump();
    }
    if (e.key === "a") {
        player.moveLeft();
        
    }
    if (e.key === "d") {
        player.moveRight();
        
    }
}

function keyUpHandler(e) {
    if (e.key === "a") {
        player.moveLeftStop();
        
    }
    if (e.key === "d") {
        player.moveRightStop();
        
    }
}