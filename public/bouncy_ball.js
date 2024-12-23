let width;
let height;
let ball1;
let ball2;
let entities = [];
let ballImg;
let ball2Img;
let center;
let debug = false;

function preload() {
  ballImg = loadImage("assets/ball.png");
  ball2Img = loadImage("assets/ball_02a.png");
  grasImg = loadImage("assets/gras.png");
}

function resetBall1() {
  ball1.position = createVector(20, -100);
  ball1.speed = createVector(3, -20);
  ball1.rotation_speed = 1 / 10;
  ball1.size = createVector(50, 50);
  ball1.acceleration = createVector(0, 0);
  ball1.bounce = true;
  ball1.bounce_factor = 0.5;
}

function resetBall2() {
  ball2.position = createVector(width - 10, -height);
  ball2.speed = createVector(-10, 0);
  ball2.rotation_speed = -1 / 10;
  ball2.size = createVector(60, 60);
  ball2.bounce = true;
  ball2.bounce_factor = 0.4;
}

function setup() {
  frameRate(60);

  width = windowWidth * 0.99;
  height = windowHeight * 0.95;

  ball1 = new Entity2d(ballImg);
  resetBall1();

  ball2 = new Entity2d(ball2Img);
  resetBall2();

  center = createVector(20, height);

  entities.push(ball1);
  entities.push(ball2);

  createCanvas(width, height);
}

function keyPressed() {
  switch (key) {
    case "d":
      debug = !debug;
      break;
    case "r":
      resetBall1();
      resetBall2();
      break;
  }
}

function draw() {
  // TODO: make it so everything can be defined in gloabl coords
  // but  will be translated into local coords for drawing
  background("#CCFFFF");

  drawFloor();

  push();
  translate(center);

  entities.forEach((entity) => {
    entity.render((debug = debug));
    entity.update();
  });

  if (debug) {
    drawCoordSystem();
  }

  pop();

  if (debug) {
    let fps = frameRate();
    text(fps, 50, 50);
  }
}

function drawFloor() {
  let w = grasImg.width / 10;
  let h = grasImg.height / 10;

  let y = center.y - h;

  for (let i = 0; i < width / w; i++) {
    image(grasImg, i * w, y, w, h);
  }
}

function drawCoordSystem() {
  stroke("lightgrey");
  strokeWeight(2);
  // x axis
  line(-width, 0, width, 0);
  // y axis
  line(0, -height, 0, height);
}
