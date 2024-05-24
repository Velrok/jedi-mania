let backgroundImg;
let playerImg;
let monsterImg;

const A_KEY = 65;
const D_KEY = 68;

let player = {
  x: 100,
  y: 500,
};

let monster = {
  x: 500,
  y: 500,
};

function preload() {
  backgroundImg = loadImage("assets/desert.jpg");
  playerImg = loadImage("assets/jedi.jpg");
  monsterImg = loadImage("assets/trouper.jpg");
}

function setup() {
  createCanvas(1200, 900);
}

function draw() {
  monster.x -= 1;
  if (monster.x < 0) {
    monster.x = 1200;
  }
  if (keyIsDown(LEFT_ARROW)) {
    console.log("left");
    player.x -= 5;
    if (player.x < 0) {
      player.x = 0;
    }
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    player.x -= 5;
    if (player.x < 0) {
      player.x = 0;
    }
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    player.x += 6;
    if (player.x > 1000) {
      player.x = 1000;
    }
  }
  image(backgroundImg, 0, 0);
  image(playerImg, player.x, player.y);
  image(monsterImg, monster.x, monster.y);
}
