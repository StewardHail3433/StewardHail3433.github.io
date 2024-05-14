const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");

if(screen.availWidth>screen.availHeight) {
    ctx.canvas.width = screen.availWidth*.7;
    ctx.canvas.height = screen.availHeight*.7;
} else {
    ctx.canvas.width = screen.availWidth;
    ctx.canvas.height = screen.availHeight;}
document.getElementById("test").innerHTML = "<p>" +screen.availWidth + ", " + screen.availHeight + "<br>"+ctx.canvas.width + ", " + ctx.canvas.height +"</p>" ;

