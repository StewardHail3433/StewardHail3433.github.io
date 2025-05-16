import Tile from "./tile.js";

const canvas = document.getElementById('mainCanvas');
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext('2d');

const canvasDiv = document.getElementById('canvasDiv');

canvasDiv.setAttribute("style", "max-width:" + (screen.availWidth * .8) + "px; max-height: " +  (screen.availHeight* .7) + "px; overflow: scroll; padding-left: 0;padding-right: 0;margin-left: auto;margin-right: auto;display: block;");

ctx.canvas.style.alignContent = "center";

var row = 20;
var col = 10;
const tileSize = 32;

ctx.canvas.width = tileSize * row;
ctx.canvas.height = tileSize * col;

var /** @type {Tile[][]}*/ map = [];

for (let i = 0; i < col; i++) {
    map[i] = [];
    for (let j = 0; j < row; j++) {
        map[i][j] = new Tile(j * tileSize, i * tileSize);
    }
}

var img = [new Image(), new Image(), new Image(),new Image(), new Image(), new Image()];

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < row; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, tileSize * i, ctx.canvas.width, 1);
    }
    for (let i = 0; i < row; i++) {
        ctx.fillStyle = "blue";
        ctx.fillRect(tileSize * i, 0, 1, ctx.canvas.height);
    }
    ctx.fillStyle = "yellow";
    //ctx.fillRect(map[0][0].x, map[0][0].y, tileSize, tileSize);

    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            let tile = map[i][j];
            if (tile.img instanceof Image) { // Check if tile.img is an Image object
                ctx.drawImage(tile.img, tile.x, tile.y, tileSize, tileSize);
            } else {
                ctx.clearRect(tile.x+1, tile.y+1, tileSize-1, tileSize-1)
            }
        }
    }
}

render();

let mousedown = false;
let startX, startY;
let mouseX, mouseY;

canvas.addEventListener("mousedown", function(e) {
    mousedown = true;
    startX = e.clientX - ctx.canvas.getBoundingClientRect().left;
    startY = e.clientY - ctx.canvas.getBoundingClientRect().top;
    mouseX = startX;
    mouseY = startY;
}, false);

canvas.addEventListener("mousemove", function(e) {
    if (mousedown) {
        mouseX = e.clientX - ctx.canvas.getBoundingClientRect().left;
        mouseY = e.clientY - ctx.canvas.getBoundingClientRect().top;
        for (let i = 0; i < col; i++) {
            for (let j = 0; j < row; j++) {
                let tile = map[i][j];
                if (mouseX >= tile.x && mouseX <= tile.x + tileSize &&
                    mouseY >= tile.y && mouseY <= tile.y + tileSize) {
                    tile.img = selected;
                    tile.value = selectedValue;
                }
            }
        }
    }
}, false);

canvas.addEventListener("mouseup", function(e) {
    mousedown = false;
    let endX = e.clientX - ctx.canvas.getBoundingClientRect().left;
    let endY = e.clientY - ctx.canvas.getBoundingClientRect().top;

    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            let tile = map[i][j];
            if (mouseX >= tile.x && mouseX <= tile.x + tileSize &&
                mouseY >= tile.y && mouseY <= tile.y + tileSize) {
                tile.img = selected;
                tile.value = selectedValue;
            }
        }
    }
}, false);

document.getElementById("load").addEventListener("change", function(e) {
    if (e.target.files[0]) {
        fetch(URL.createObjectURL(e.target.files[0]))
            .then((res) => res.text())
            .then((text) => {
                let lines = text.trim().split('\n');
                row = lines.length;
                col = lines[0].trim().split(" ").length;
                for (let i = 0; i < lines.length; i++) {
                    map[i] = [];
                    let values = lines[i].trim().split(" ");
                    for (let j = 0; j < values.length; j++) {
                        map[i][j] = new Tile(j * tileSize, i * tileSize);
                        map[i][j].value = parseInt(values[j]);
                        if (map[i][j].value >= 1 && map[i][j].value <= 9) { // Assuming num 1 and 2 are used for images
                            map[i][j].img = img[map[i][j].value-1];
                        }
                    }
                }
                render(); // Render after loading map
            })
            .catch((e) => console.error(e));
    }
}, false);

var selected;
var selectedValue = 0;
window.addEventListener("keydown", function(e) {
    if (e.key === "1") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "2") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "3") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "4") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "5") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "6") {
        selected = img[e.key-1];
        selectedValue = e.key;
    } else if (e.key === "?") {
        let mapData = map.map(row => row.map(tile => tile.value).join(' ')).join('\n');
        let blob = new Blob([mapData], { type: 'text/plain' });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'level.txt';
        a.click();
    } else if (e.key === "0") {
        selected = null;
        selectedValue = e.key;
    }
});

requestAnimationFrame(loop);

function loop(timestamp) {
    render();
    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            let tile = map[i][j];
            if(tile.value != 0 && document.getElementById(tile.value.toString()).files[0] != null){
                if( tile.img != img[tile.value-1]) {
                    tile.img = img[tile.value-1]
                }
            }
        }
    }
    requestAnimationFrame(loop);
}

document.getElementById("1").addEventListener("change", function(e) {
    img[0].src = URL.createObjectURL(document.getElementById("1").files[0]);
})

document.getElementById("2").addEventListener("change", function(e) {
    img[1].src = URL.createObjectURL(document.getElementById("2").files[0]);
})

document.getElementById("3").addEventListener("change", function(e) {
    img[2].src = URL.createObjectURL(document.getElementById("3").files[0]);
})

document.getElementById("4").addEventListener("change", function(e) {
    img[3].src = URL.createObjectURL(document.getElementById("4").files[0]);
})

document.getElementById("5").addEventListener("change", function(e) {
    img[4].src = URL.createObjectURL(document.getElementById("5").files[0]);
})

document.getElementById("6").addEventListener("change", function(e) {
    img[5].src = URL.createObjectURL(document.getElementById("6").files[0]);
})

document.getElementById("row").addEventListener("change", function(e) {
    row = parseInt(document.getElementById("row").value);
    ctx.canvas.width = tileSize * row;
    map = []
    for (let i = 0; i < col; i++) {
        map[i] = [];
        for (let j = 0; j < row; j++) {
            map[i][j] = new Tile(j * tileSize, i * tileSize);
        }
    }
})

document.getElementById("col").addEventListener("change", function(e) {
    col = parseInt(document.getElementById("col").value);
    ctx.canvas.height = tileSize * col;
    map = [];
    for (let i = 0; i < col; i++) {
        map[i] = [];
        for (let j = 0; j < row; j++) {
            map[i][j] = new Tile(j * tileSize, i * tileSize);
        }
    }
})
