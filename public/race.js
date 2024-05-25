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

let areWeLightSpeed = false;

let player = {
  name: "player",
  x: 10,
  y: baseLevel - 100,
  img: null,
  speed: 35,
};

let oponent1 = {
  name: "oponent1",
  x: 0,
  y: baseLevel - 100,
  img: null,
  speed: 1,
};

let oponent2 = {
  name: "oponent2",
  x: 0,
  y: baseLevel,
  img: null,
  speed: 2,
};

let oponents = [oponent1, oponent2];

function preload() {
  lightSpeedImg = loadImage("/assets/lightspeed.jpg");
  backgroundImg = loadImage("assets/desert.jpg");
  player.img = loadImage("assets/shuttle.jpg");
  oponent1.img = loadImage("assets/drone.jpg");
  oponent2.img = loadImage("assets/anikin.jpg");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);
}

let winner = "unknown";

function drawImageEntity(imageEntity) {
  image(imageEntity.img, imageEntity.x, imageEntity.y);
}

function drawWinner(winner) {
  if (winner !== "unknown") {
    textSize(100);
    if (winner === "player") {
      text("🏆 You win! 🏆", 300, HEIGHT / 2);
    } else {
      text("😞 Too slow. 😞", 300, HEIGHT / 2);
    }
  }
}

function drawOponents() {}

function determineWinner() {
  if (winner === "unknown") {
    if (player.x >= WIDTH) {
      console.log("player wins");
      winner = "player";
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

function drawScene() {
  image(backgroundImg, 0, 0);
  oponents.forEach((oponent) => {
    drawImageEntity(oponent);
  });
  if (areWeLightSpeed) {
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

const playerSpeedDataWindowSize = 2;
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

const lightSpeedBarrier = 12;
let lastMoveFrame = 0;

function checkIfWeAreLightSpeed() {
  if (playerSpeedData.data.length === playerSpeedDataWindowSize) {
    let firstFrame = playerSpeedData.data[0];
    let lastFrame = playerSpeedData.data[playerSpeedDataWindowSize - 1];
    let frames = lastFrame - firstFrame;

    areWeLightSpeed =
      frames <= lightSpeedBarrier && lastFrame + 30 > frameCount;
  }
}

function draw() {
  checkIfWeAreLightSpeed();
  movePlayer();
  moveOponents();
  determineWinner();

  drawScene();
}
