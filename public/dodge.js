let backgroundImg;

const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

const WIDTH = 600;
const HEIGHT = 800;

let placeholderImg;
// let bingoImg;

let thingsCollection = [];

function preload() {
  placeholderImg = loadImage("assets/placeholder.png");
  // bingoImg = loadImage("assets/bingo.jpg");
}

function setupPlayer() {
  bingo = {
    name: "bingo",
    x: 10,
    y: 10,
    img: bingoImg,
    speed: 35,
  };
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  setupPlayer();
  frameRate(60);
}

function drawImageEntity(imageEntity) {
  image(imageEntity.img, imageEntity.x, imageEntity.y);
}

function drawScene() {
  background(51);
  drawImageEntity(bingo);
}

function movePlayer() {
}

function draw() {
  movePlayer();
  moveOponents();
  determineWinner();
  drawScene();
}
