let backgroundImg;
let lightSpeedImg;

const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;
const J_KEY = 74;
const K_KEY = 75;
const F_KEY = 70;

const WIDTH = 1200;
const HEIGHT = 900;

let baseLevel = 650;

let atLightSpeed = false;

let scoreBoard = [];

let player = {
  name: "player",
  x: 10,
  y: baseLevel - 100,
  img: null,
  speed: 35,
};

let drone = {
  name: "drone",
  x: 0,
  y: baseLevel - 100,
  img: null,
  speed: 1,
};

let anikin = {
  name: "anikin",
  x: 0,
  y: baseLevel,
  img: null,
  speed: 2,
};

let greenSpeeder = {
  name: "greenSpeeder",
  x: 0,
  y: baseLevel,
  img: null,
  speed: 2.5,
};

let mixedSpeeder = {
  name: "mixedSpeeder",
  x: 0,
  y: baseLevel,
  img: null,
  speed: 3,
};

let allOponents = [drone, anikin, greenSpeeder, mixedSpeeder];
let oponents = [];

function preload() {
  lightSpeedImg = loadImage("assets/lightspeed.jpg");
  backgroundImg = loadImage("assets/desert.jpg");
  player.img = loadImage("assets/shuttle.jpg");
  drone.img = loadImage("assets/drone.jpg");
  greenSpeeder.img = loadImage("assets/green.jpg");
  mixedSpeeder.img = loadImage("assets/mix.jpg");
  anikin.img = loadImage("assets/anikin.jpg");
}

function shuffle(unshuffled) {
  return unshuffled
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => b.sort - a.sort)
    .map(({ value }) => value);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);
  oponents = shuffle(allOponents).slice(0, 2);
  scoreBoard = JSON.parse(localStorage.getItem("scoreBoard")) || [];
}

let winner = "unknown";

function drawImageEntity(imageEntity) {
  image(imageEntity.img, imageEntity.x, imageEntity.y);
}

function drawWinner(winner) {
  if (winner !== "unknown") {
    textSize(100);
    const x = 300;
    const y = 150;
    if (winner === "player") {
      text("🏆 You win! 🏆", x, y);
      const lineHeight = 100;
      textSize(70);
      textFont("Courier New");
      scoreBoard.forEach((score, index) => {
        let entry =
          score.name.padEnd(10, ".") + score.score.toString().padStart(5, "0");
        text(entry, x, y + lineHeight * (index + 1));
      });
    } else {
      text("😞 Too slow. 😞", x, y);
    }
  }
}

function determineWinner() {
  if (winner === "unknown") {
    if (player.x >= WIDTH) {
      console.log("player wins");
      winner = "player";
      let playerName = prompt("Enter your name for the high score board");
      const score = (WIDTH - frameCount) * 10;
      scoreBoard.push({ name: playerName, score: score });
      scoreBoard.sort((a, b) => b.score - a.score);
      while (scoreBoard.length > 5) {
        scoreBoard.pop();
      }
      localStorage.setItem("scoreBoard", JSON.stringify(scoreBoard));
      console.log(scoreBoard);
    } else {
      oponents.forEach((oponent) => {
        if (oponent.x >= WIDTH) {
          console.log("oponent wins");
          winner = oponent.name;
        }
      });
    }
  }
}

function drawInstructions() {
  textSize(20);
  text("📋Alternate a/s or j/k to race; f to toggle fullscreen", 40, 840);
}

function drawScene() {
  image(backgroundImg, 0, 0);
  drawInstructions();
  oponents.forEach((oponent) => {
    drawImageEntity(oponent);
  });
  if (atLightSpeed) {
    image(lightSpeedImg, 0, 0);
  }
  drawImageEntity(player);
  drawWinner(winner);
}

function moveOponents() {
  oponents.forEach((oponent) => {
    oponent.x += oponent.speed;
  });
}

const KEY_SET_1 = [A_KEY, J_KEY];
const KEY_SET_2 = [S_KEY, K_KEY];
let targetKeySet = KEY_SET_1;

class DataWindow {
  constructor(size) {
    this.size = size;
    this.data = [];
  }

  addData(data) {
    this.data.push(data);
    if (this.data.length > this.size) {
      this.data.shift();
    }
    return this.data;
  }
}

const playerSpeedDataWindowSize = 3;
let playerSpeedData = new DataWindow(playerSpeedDataWindowSize);

function movePlayer() {
  if (keyIsPressed) {
    if (targetKeySet.includes(keyCode)) {
      player.x += player.speed;
      playerSpeedData.addData(frameCount);
      targetKeySet = targetKeySet === KEY_SET_1 ? KEY_SET_2 : KEY_SET_1;
    }
  }
}

function keyTyped() {
  // console.log(keyCode);
  if (keyCode === F_KEY) {
    fullscreen(!fullscreen());
  }
  return false;
}

const lightSpeedBarrier = 15;
let lastMoveFrame = 0;

function areWeLightSpeedYet() {
  if (playerSpeedData.data.length === playerSpeedDataWindowSize) {
    let firstFrame = playerSpeedData.data[0];
    let lastFrame = playerSpeedData.data[playerSpeedDataWindowSize - 1];
    let frames = lastFrame - firstFrame;

    atLightSpeed =
      frames <= lightSpeedBarrier && lastFrame + lightSpeedBarrier > frameCount;
  }
}

function draw() {
  areWeLightSpeedYet();
  movePlayer();
  moveOponents();
  determineWinner();

  drawScene();
}
