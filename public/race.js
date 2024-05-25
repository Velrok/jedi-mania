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
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);
  oponents = shuffle(allOponents).slice(0, 2);
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
