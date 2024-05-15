import Button from "./button.js";


const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");
let interval;

var button = new Button(canvas, 10, 10, 40, 40, "red");

if(screen.availWidth>screen.availHeight) {
    ctx.canvas.width = screen.availWidth*.8;
    ctx.canvas.height = screen.availHeight*.7;
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
    if (button.isPressed()) {
        button.setColor("green");
    } else {
        button.setColor("red");
    }
}

runButton.addEventListener("click", function () {
    canvas.addEventListener("touchend", button.touchButton, {passive:false});
    canvas.addEventListener("touchmove", button.touchButton, {passive:false});
    canvas.addEventListener("touchstart", button.touchButton, {passive:false});

    interval = setInterval(update, 10);
    this.disable = false;
})