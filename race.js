let backgroundImg;
let racer1Img;
let racer2Img;
let racer3Img;

const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

const WIDTH = 1200;
const HEIGHT = 900;

let targetKey = A_KEY;

let baseLevel = 650;

let player = {
  x: 10,
  y: baseLevel - 100,
};

let oponent1 = {
  x: 0,
  y: baseLevel - 100,
};

let oponent2 = {
  x: 0,
  y: baseLevel,
};

function preload() {
  backgroundImg = loadImage("assets/desert.jpg");
  racer1Img = loadImage("assets/shuttle.jpg");
  racer2Img = loadImage("assets/drone.jpg");
  racer3Img = loadImage("assets/anikin.jpg");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

let winner = null;

function draw() {
  oponent1.x += 1;
  oponent2.x += 2;

  if (!winner) {
    if (player.x >= WIDTH) {
      console.log("player wins");
      winner = "player";
    } else if (oponent1.x >= WIDTH) {
      console.log("oponent1 wins");
      winner = "oponent1";
    } else if (oponent2.x >= WIDTH) {
      console.log("oponent2 wins");
      winner = "oponent2";
    }
  }

  if (keyIsPressed) {
    if (keyCode === targetKey) {
      player.x += 35;
      targetKey = targetKey === A_KEY ? S_KEY : A_KEY;
    }
  }

  image(backgroundImg, 0, 0);
  image(racer2Img, oponent1.x, oponent1.y);
  image(racer3Img, oponent2.x, oponent2.y);
  image(racer1Img, player.x, player.y);

  if (winner) {
    textSize(100);
    if (winner === "player") {
      text("🏆 You win 🏆", 300, HEIGHT / 2);
    } else {
      text("😞 You lose 😞", 300, HEIGHT / 2);
    }
  }
}
