var GAME = {
    width: 800,
    height: 700,
    lose: false
}

var canvas = document.getElementById('canvas')
canvas.width = GAME.width;
canvas.height = GAME.height;
var canvasContext = canvas.getContext('2d');

var InfoWindow = {
    width: 200,
    height: GAME.height,
    x: GAME.width - 200,
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    scoreTextY: 50,
    scorey: 85,
    livey: 120,
}

var PlayArea = {
    width: GAME.width - InfoWindow.width,
    height: GAME.height,
    backgroundColor: "#FFEE55"
}

var PLAYER = {
    width: 150,
    height: 50,
    xDirection: 10,
    x: PlayArea.width / 2,
    y: GAME.height - 50,
    color: "#123456",
    score: 0,
    lives: 3,
}

var ENEMY = {
    x: PlayArea.width / 2,
    y: 50,
    radius: 20,
    yDirection: 10,
    color: "#FFFFFF"
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height)
    drawBackground();
    drawEnemy();
    drawPlayer();
    drawInfoWindow();
}

function drawBackground() {
    canvasContext.fillStyle = PlayArea.backgroundColor;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

function drawEnemy() {
    canvasContext.fillStyle = ENEMY.color;
    canvasContext.beginPath();
    canvasContext.arc(ENEMY.x, ENEMY.y, ENEMY.radius, 0, 2 * Math.PI);
    canvasContext.fill();
}

function drawPlayer() {
    canvasContext.fillStyle = PLAYER.color;
    canvasContext.fillRect(PLAYER.x, PLAYER.y, PLAYER.width, PLAYER.height);
}

function drawInfoWindow() {
    canvasContext.fillStyle = InfoWindow.backgroundColor;
    canvasContext.fillRect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.font = '30px Arial';
    canvasContext.fillStyle = InfoWindow.textColor;
    canvasContext.fillText("Your score:", InfoWindow.x + 10, InfoWindow.scoreTextY);
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, InfoWindow.scorey);
    canvasContext.fillText("Your lives: " + PLAYER.lives, InfoWindow.x + 10, InfoWindow.livey);
}


function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function respawnEnemy() {
    ENEMY.radius = getRandomNum(15, 25);
    ENEMY.x = getRandomNum(0 + ENEMY.radius, PlayArea.width - ENEMY.radius);
    ENEMY.y = -ENEMY.radius;
    ENEMY.yDirection = getRandomNum(10, 20)
}


function updateEnemy() {
    ENEMY.y += ENEMY.yDirection;

    var topCollision = ENEMY.y + ENEMY.radius > PLAYER.y;
    var leftCollision = ENEMY.x + ENEMY.radius > PLAYER.x;
    var rightCollision = ENEMY.x - ENEMY.radius < PLAYER.x + PLAYER.width;

    if (ENEMY.y - ENEMY.radius > PlayArea.height) {
        respawnEnemy()
        PLAYER.score++;
    }

    if (topCollision && leftCollision && rightCollision) {
        respawnEnemy()
        PLAYER.lives--;
        if (PLAYER.lives === 0) {
            GAME.lose = true
        }
    }

}

function initEventListeners() {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener("keydown", onKeyDown)
}

function playerCollision() {
    if (PLAYER.x + PLAYER.width > PlayArea.width) {
        PLAYER.x = PlayArea.width - PLAYER.width
    }

    if (PLAYER.x < 0) {
        PLAYER.x = 0
    }
}

function onMouseMove(event) {
    PLAYER.x = event.clientX;
    playerCollision();
}

function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
        PLAYER.x -= PLAYER.xDirection;
    }
    if (event.key === "ArrowRight") {
        PLAYER.x += PLAYER.xDirection;
    }

    playerCollision();
}

function drawLoseScreen() {
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
    canvasContext.font = '70px Arial';
    canvasContext.textAlign = "center"
    canvasContext.fillStyle = "#FFFFFF";
    canvasContext.fillText("You Lose!", GAME.width / 2, GAME.height / 2);
}

function play() {
    drawFrame();
    if (!GAME.lose) {
        updateEnemy();
        requestAnimationFrame(play)
    }
    else {
        drawLoseScreen();
    }
}

initEventListeners();
play();