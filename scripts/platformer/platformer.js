const canvas = document.getElementById("platformerCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");

ctx.canvas.width = screen.availWidth*.7;
ctx.canvas.height = screen.availHeight*.7;
