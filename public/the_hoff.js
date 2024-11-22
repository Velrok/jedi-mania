let width;
let height;
let ball1;
let ball2;
let entities = [];
let ballImg;
let ball2Img;
let center;
let reloading = 0;
let debug = false;
let viewPort;

function preload() {
  payerImg = loadImage("assets/scout_trouper.png");
  cloneTroupersImg = loadImage("assets/clone_troupers.png");
  riderCloneImg = loadImage("assets/rider_clone.png");
  backgroundImg = loadImage("assets/theHoff.png");
  laserShotImg = loadImage("assets/laser_shot_01.png");
}

function setup() {
  frameRate(60);

  width = windowWidth * 0.99;
  height = windowHeight * 0.95;

  viewPort = {
    size: createVector(width, height),
    position: createVector(width / 2, height / 2),
  };

  payer = new Entity2d(payerImg);
  payer.size = createVector(500, 500);
  payer.position = createVector(payer.size.x / 2, -payer.size.y / 2);
  payer.gravity = createVector(0, 0);
  entities.push(payer);

  cloneTroupers = new Entity2d(cloneTroupersImg);
  cloneTroupers.position = createVector(850, -100);
  cloneTroupers.speed = createVector(0, -10);
  cloneTroupers.size = createVector(300, 150);
  cloneTroupers.gravity = createVector(0, 0);
  cloneTroupers.drag_factor = 1;
  entities.push(cloneTroupers);

  // riderClone = new Entity2d(riderCloneImg);
  // riderClone.position = createVector(20, -100);
  // riderClone.gravity = createVector(0, 0);

  center = createVector(20, height);

  createCanvas(width, height);
}

function draw() {
  handleGamepad();
  enemyAI();

  push();
  translateToViewPort();
  // renderBackground();

  entities.forEach((entity) => {
    push();
    entity.render((debug = debug));
    pop();
    entity.update();
  });
  pop();

  reloading -= 1;

  entities = entities.filter((entity) => {
    return (
      entity.position.x < width &&
      entity.position.y < height &&
      entity.position.y > -height &&
      entity.position.x > -width
    );
  });

  if (debug) {
    drawCoordSystem();
  }

  // pop();

  if (debug) {
    let fps = frameRate();
    text(fps, 50, 50);
    text(entities.length, 50, 65);
    // console.log(entities.length);
  }
}

function translateToViewPort() {
  translate(
    viewPort.position.x - viewPort.size.x / 2,
    viewPort.position.y + viewPort.size.y / 2
  );
}

function renderBackground() {
  push();
  let factor = 1 / 4;
  translate(-520, 0);
  scale(factor, factor);
  image(backgroundImg, 0, 0);
  pop();
}

function handleGamepad() {
  var gamepads = navigator.getGamepads();
  let controller = gamepads[0]; //controllers[i]

  if (controller) {
    // console.log(controller.buttons[8]);
    // console.log(controller.buttons[9]);
    // console.log(controller.buttons[10]);
    // console.log(controller.buttons[11]);

    leftXAxis = controller.axes[0];
    leftYAxis = controller.axes[1];

    payer.speed.x = leftXAxis * payer.maxSpeed;
    payer.speed.y = leftYAxis * payer.maxSpeed;

    if (controller.buttons[R1].pressed && reloading <= 0) {
      reloading = 10;
      laserShot = new Entity2d(laserShotImg);
      laserShot.position = payer.position.copy();
      laserShot.size = createVector(20, 10);
      laserShot.speed = createVector(25, 0);
      laserShot.gravity = createVector(0, 0);
      laserShot.drag_factor = 1;

      entities.push(laserShot);
    }

    // console.log(leftXAxis);
    // console.log(leftYAxis);
  }
}

function enemyAI() {
  fill("red");
  strokeWeight(12);
  line(-width, 0, width, 0);
  fill("yellow");
  line(0, -height, 0, height);
  // if (cloneTroupers.position.y >= height || cloneTroupers.position.y <= 0) {
  //   cloneTroupers.speed.y *= -1;
  // }
}

function drawFloor() {
  // let w = grasImg.width / 10;
  // let h = grasImg.height / 10;
  // let y = center.y - h;
  // for (let i = 0; i < width / w; i++) {
  // image(grasImg, i * w, y, w, h);
  // }
}

function drawCoordSystem() {
  stroke("lightgrey");
  strokeWeight(2);
  // x axis
  line(-width, 0, width, 0);
  // y axis
  line(0, -height, 0, height);
}
