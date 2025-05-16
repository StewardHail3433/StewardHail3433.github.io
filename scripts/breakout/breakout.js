
const canvas = document.getElementById("myCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");

let interval;

let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
const ballRadius = 10;
let ballColorIndex = 0
let ballColor = "yellow"
let dx = 2;
let dy = -2;

let paddleWidth = ballRadius*6;
let paddleHeight = 10;
let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleY = canvas.height - 20;
const paddleColor = "lightblue";
let paddleDx = 2.3;
let paddleDy = -2.3;

ctx.beginPath();
ctx.rect(paddleX, paddleY, paddleWidth, 10);
ctx.fillStyle = paddleColor;
ctx.fill();
ctx.lineWidth = 2;
ctx.strokeStyle = "rgb(0, 0, 0)";
ctx.stroke();
ctx.closePath();

let mouseX = canvas.width / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let brokenbricks = 0;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, broken: false};
  }
}
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        if(bricks[c][r].broken == false) {
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        }
      }
    }
  }
  

function drawBall() {
        // START: draw circle
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
        switch(ballColorIndex){
            case 0:
                ballColor = "yellow";
                break;
            case 1:
                ballColor = "green";
                break;
            case 2:
                ballColor = "blue";
                break;
            case 3:
                ballColor = "indigo ";
                break;
            case 4:
                ballColor = "violet";
                break;
            case 5:
                ballColor = "red";
                break;
            case 6:
                ballColor = "orange";
                break;
        }        
        ctx.fillStyle = ballColor;
        ctx.fill();
        ctx.closePath();
        // START: draw circle
}

function drawPaddle() {
    // START: draw circle
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, 10);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.stroke();
    ctx.closePath();
}

function drawText() {

    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeText("Score: " + score, 0, 10);
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawText();

    if ((ballX + ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth && ballY + ballRadius > paddleY)) {
        if(ballY + ballRadius > paddleY + 3) {
            dx *= -1
        }
        dy *= -1;
    }

        
    if(ballX + ballRadius > canvas.width || ballX - ballRadius < 0){
        dx *= -1;
        ballColorIndex += 1;
    }
    if(ballY - ballRadius < 0){
        dy *= -1;
        ballColorIndex += 1;
    } else if(ballY + ballRadius > canvas.height) {
        {alert("GAME OVER");
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        dy*=0
        document.location.reload();
        clearInterval(this.interval);}
    }
    
    if(selected == "key") {
        if (rightPressed) {
            paddleX = Math.min(paddleX + paddleDx, canvas.width - paddleWidth);
        } else if (leftPressed) {
            paddleX = Math.max(paddleX - paddleDx, 0);
        }
    } else {
        if(paddleX +paddleWidth/2 > mouseX+3 && paddleX +paddleWidth/2 < mouseX-3){}
        else{
        if (mouseX > paddleX + paddleWidth/2) {
            paddleX = Math.min(paddleX + paddleDx, canvas.width - paddleWidth);
        } else {
            paddleX = Math.max(paddleX - paddleDx, 0);
        }
        }
    }
    if(ballColorIndex == 7) {
        ballColorIndex = 0;
    }

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if(ballY + ballRadius*2 >= bricks[c][r].y && 
                ballY <= bricks[c][r].y + brickHeight &&
                ballX <= bricks[c][r].x + brickWidth &&
                ballX + ballRadius*2 >= bricks[c][r].x && bricks[c][r].broken == false) {
                    bricks[c][r].broken = true;
                    score += 15;
                    brokenbricks++;
                    dy *= -1;
                    if (dx < 0) {
                        dx -= 0.05;
                    } else {
                        dx += 0.05;
                    }
            }
            
            if (brokenbricks == brickRowCount * brickColumnCount) {
                alert("YOU WIN");
                document.location.reload();
                clearInterval(this.interval);
            }
        }
    }

    ballX += dx;
    ballY += dy;
}

function startGame() {
    
    // document.addEventListener("touchstart", touchMove, false);
    switch(selected) {
        case "key":
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            break;
        case "mouse":
            document.addEventListener("mousemove", mouseMove, false);
            break;
        case "touch":
            document.addEventListener("touchstart", touchMove, false);
            break;
    }
    if (Math.random() < 0.5) {
        dx = -2;
    } 
    clearInterval(interval)
    interval = setInterval(draw, 10);
}

function mouseMove(e) {
    mouseX = e.clientX  - canvas.getBoundingClientRect().left;
    // console.log(mouseX);
    console.log("score: " + score);
    document.getElementById("idk").innerHTML = "<p>" + mouseX + "</p>";
}

function touchMove(e) {
        mouseX = e.originalEvent.touches[0].pageX  - canvas.getBoundingClientRect().left;
        document.getElementById("idk").innerHTML = "<p>" + mouseX + "</p>";
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" ) {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" ) {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
        leftPressed = false;
    }
}


document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
    document.getElementById("touch").disabled = true;
    document.getElementById("mouse").disabled = true;
    document.getElementById("key").disabled = true;
});

let selected = "touch";
function controls() {
    
    document.getElementById("touch").addEventListener("click", function () {
        selected = "touch";
    })
    document.getElementById("mouse").addEventListener("click", function () {
        selected = "mouse";
    })
    document.getElementById("key").addEventListener("click", function () {
        selected = "key";
    })
    document.getElementById("selected").innerHTML = "<p>Selected: " + selected + "</p>";
}
interval = setInterval(controls, 10);