import Button from "./button.js";


const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");
let interval;

var button = new Button(canvas, 10, 10, 40, 40, "red");


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

document.getElementById("test").innerHTML = "<p>" + isTouchDevice() + "</p>";
button.test();
function update() {
    button.draw(ctx);
    if (button.isPressed() && button.isInputDown()) {
        button.setColor("green");
    } else {
        button.setColor("red");
    }
}
function touchStart(event) {
    button.touchButton(event.touches[0], canvas);
    event.preventDefault();
    document.getElementById("test2").innerText = document.getElementById("test2").innerText + " start";
    button.setInputDown(true);
}
function touchMove(event) {
    if(button.isInputDown()) {
        button.touchButton(event.touches[0], canvas); 
        event.preventDefault(); 
        document.getElementById("test2").innerText = document.getElementById("test2").innerText + " mid " + button.isInputDown();
    }
}
function touchEnd(event) {
    button.touchButton(event.touches[0], canvas); 
    event.preventDefault(); 
    document.getElementById("test2").innerText = document.getElementById("test2").innerText + " end";
    button.setInputDown(false);
}

function mouseDown(event) {
    button.touchButton(event, canvas);
    event.preventDefault();
    document.getElementById("test2").innerText = document.getElementById("test2").innerText + " start";
    button.setInputDown(true);
}
function mouseMove(event) {
    if(button.isInputDown()) {
        button.touchButton(event, canvas); 
        event.preventDefault(); 
        document.getElementById("test2").innerText = document.getElementById("test2").innerText + " mid";
    }
}
function mouseUp(event) {
    button.touchButton(event, canvas); 
    event.preventDefault(); 
    document.getElementById("test2").innerText = document.getElementById("test2").innerText + " end";
    button.setInputDown(false);
}

runButton.addEventListener("click", function () {
    if (isTouchDevice()) {
        canvas.addEventListener("touchstart", function (event) {touchStart(event)}, { passive: false });
        canvas.addEventListener("touchmove", function (event) {touchMove(event)}, { passive: false });
        canvas.addEventListener("touchend", function (event) {mouseUp(event)}, { passive: false });
    } else {
        canvas.addEventListener("mousedown", function (event) {mouseDown(event)}, { passive: false });
        canvas.addEventListener("mousemove", function (event) {mouseMove(event)}, { passive: false });
        canvas.addEventListener("mouseup", function (event) {mouseUp(event)}, { passive: false });
    }

    interval = setInterval(update, 10);
    this.disable = false;
})