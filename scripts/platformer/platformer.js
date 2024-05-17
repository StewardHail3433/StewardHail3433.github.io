import Button from "./button.js";
import Player from "./player.js";


const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");
let interval;



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


//entity
var player = new Player(ctx);

document.getElementById("test").innerHTML = "<p>" + ctx.canvas.height + "</p>";

/** @type {Button} */var buttons;
function buttonUpdate() {
    for(let button of buttons) {
        button.draw(ctx);
        if (button.isPressed() && button.isInputDown()) {
            button.setColor("green");
            if(button.getName() == "left") {
                player.moveLeft();
            }
            if(button.getName() == "right") {
                player.moveRight();
            }
            if(button.getName() == "jump") {
                player.moveJump();
            }
        } else {
            button.setColor("red");
            if(button.getName() == "left") {
                player.moveLeftStop();
            }
            if(button.getName() == "right") {
                player.moveRightStop();
            }
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    //if(isTouchDevice()) {
        buttonUpdate();
    //}
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
    for (let /** @type {Button} */ button of buttons) {
        if(button.isInputDown()) {
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

    interval = setInterval(update, 10);
    this.disable = true;
})

function keyDownHandler(e) {
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