// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Mobile screen ke hisaab se canvas size set karo
const baseWidth = 480;
const baseHeight = 270;

function resizeCanvas() {
  const scale = Math.min(
    window.innerWidth / baseWidth,
    window.innerHeight / baseHeight
  );
  canvas.style.width = baseWidth * scale + "px";
  canvas.style.height = baseHeight * scale + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Game constants
const groundY = canvas.height - 40; // जमीन की ऊँचाई
const gravity = 0.6;
const jumpStrength = -12;
const obstacleSpeed = 5;

// Player object
const player = {
  x: 50,
  y: groundY - 60,
  width: 30,
  height: 30,
  color: "#ffeb3b",
  velocityY: 0,
  isJumping: false,
};

// Obstacle array
let obstacles = [];
let frameCount = 0;
let gameOver = false;
let score = 0;

// Input handling (touch + click + keyboard)
function handleJump() {
  if (!player.isJumping && !gameOver) {
    player.velocityY = jumpStrength;
    player.isJumping = true;
  } else if (gameOver) {
    // Game over के बाद tap / space से restart
    resetGame();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    handleJump();
  }
});

canvas.addEventListener("click", handleJump);
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  handleJump();
});

// Reset game
function resetGame() {
  gameOver = false;
  score = 0;
  frameCount = 0;
  obstacles = [];
  player.y = groundY - player.height;
  player.velocityY = 0;
  player.isJumping = false;
}

// Create new obstacle
function createObstacle() {
  const width = 30;
  const height = 30;
  const obstacle = {
    x: canvas.width,
    y: groundY - height,
    width: width,
    height: height,
    color: "#ff5722",
  };
  obstacles.push(obstacle);
}

// Update player
function updatePlayer() {
  // Gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // Ground collision
  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.isJumping = false;
  }
}

// Update obstacles
function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.x -= obstacleSpeed;

    // Remove off-screen obstacles
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score++; // हर obstacle पार करने पर score बढ़े
    }
  }

  // हर कुछ time बाद नया obstacle
  if (frameCount % 90 === 0) {
    createObstacle();
  }
}

// Collision detection
function checkCollision() {
  for (let obs of obstacles) {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  }
}

// Draw functions
function drawGround() {
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "16px Arial";
  ctx.fillText(
    "Tap / click या SPACE दबाकर restart करो",
    canvas.width / 2,
    canvas.height / 2 + 20
  );
  ctx.textAlign = "start";
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGround();

  if (!gameOver) {
    frameCount++;
    updatePlayer();
    updateObstacles();
    checkCollision();
    drawPlayer();
    drawObstacles();
    drawScore();
  } else {
    drawPlayer();
    drawObstacles();
    drawScore();
    drawGameOver();
  }

  requestAnimationFrame(gameLoop);
}

// Start the game
resetGame();
gameLoop();