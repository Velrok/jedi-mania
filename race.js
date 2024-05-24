let backgroundImg;

const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;
const J_KEY = 74;
const K_KEY = 75;

const WIDTH = 1200;
const HEIGHT = 900;

let baseLevel = 650;

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
  backgroundImg = loadImage("assets/desert.jpg");
  player.img = loadImage("assets/shuttle.jpg");
  oponent1.img = loadImage("assets/drone.jpg");
  oponent2.img = loadImage("assets/anikin.jpg");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
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

function movePlayer() {
  if (keyIsPressed) {
    console.log(keyCode);
    if (targetKeySet.includes(keyCode)) {
      player.x += player.speed;
      targetKeySet = targetKeySet === KEY_SET_1 ? KEY_SET_2 : KEY_SET_1;
    }
  }
}

function draw() {
  movePlayer();
  moveOponents();
  determineWinner();

  drawScene();
}
