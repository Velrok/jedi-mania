let width;
let height;
let player;
let entities = [];
let playerImg;
let center;
let debug = false;

function preload() {
  // backgroundImg = loadImage("assets/desert.jpg");
  playerImg = loadImage("assets/ball.png");
  // monsterImg = loadImage("assets/trouper.jpg");
}

function setup() {
  width = windowWidth * 0.99;
  height = windowHeight * 0.95;
  player = new Entity2d(playerImg);
  // player.scale = createVector(1 / 10, 1 / 10);
  player.position = createVector(20, -100);
  player.speed = createVector(3, -20);
  player.rotation_speed = 1 / 10;
  player.size = createVector(50, 50);
  player.acceleration = createVector(0, 0);
  player.bounce = true;
  player.bounce_factor = 0.5;

  center = createVector(20, height - 20);

  entities.push(player);

  createCanvas(width, height);
  background(200);
}

function draw() {
  background(200);

  push();
  translate(center);

  entities.forEach((entity) => {
    entity.render((debug = debug));
    entity.update();
  });
  pop();

  if (debug) {
    let fps = frameRate();
    text(fps, 50, 50);
  }
}
