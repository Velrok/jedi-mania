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
let backgroundImgScale;
let levelDimensions;

function preload() {
  playerImg = loadImage("assets/scout_trouper.png");
  cloneTroupersImg = loadImage("assets/clone_troupers.png");
  riderCloneImg = loadImage("assets/rider_clone.png");
  backgroundImg = loadImage("assets/theHoff.png");
  laserShotImg = loadImage("assets/laser_shot_01.png");
}

function setup() {
  frameRate(60);

  width = windowWidth * 0.99;
  height = windowHeight * 0.95;

  backgroundImgScale = 1 / 4;

  levelDimensions = createVector(
    backgroundImg.width * backgroundImgScale,
    backgroundImg.height * backgroundImgScale
  );

  viewPort = {
    size: createVector(width, height),
    position: createVector(width / 2, height / 2),
  };

  player = new Entity2d(playerImg, 1 / 10);
  player.position = createVector(player.size.x, player.size.y);
  player.levelBoundry = {
    topLeft: createVector(0, levelDimensions.y - 1),
    bottomRight: createVector(levelDimensions.x - 1, 0),
  };
  player.gravity = createVector(0, 0);
  player.maxSpeed = 15;
  entities.push(player);

  // cloneTroupers = new Entity2d(cloneTroupersImg, 1 / 100);
  // cloneTroupers.position = createVector(850, -100);
  // cloneTroupers.speed = createVector(0, -10);
  // cloneTroupers.gravity = createVector(0, 0);
  // cloneTroupers.drag_factor = 1;
  // entities.push(cloneTroupers);

  // riderClone = new Entity2d(riderCloneImg);
  // riderClone.position = createVector(20, -100);
  // riderClone.gravity = createVector(0, 0);

  center = createVector(20, height);

  createCanvas(width, height);
}

function draw() {
  handleGamepad();
  handleKeyboard();
  enemyAI();

  push();
  translateToViewPort();
  renderBackground();

  entities.forEach((entity) => {
    push();
    entity.render((debug = debug));
    pop();
    entity.update();
  });

  if (debug) {
    drawCoordSystem();
  }

  pop();

  reloading -= 1;

  entities = filterOutDeadEntities(entities);

  // pop();

  if (debug) {
    let fps = frameRate();
    text(fps, 50, 50);
    text(entities.length, 50, 65);
  }
}

function filterOutDeadEntities(entities) {
  return entities.filter((entity) => {
    return (
      entity.position.x < width &&
      entity.position.y < height &&
      entity.position.y > -height &&
      entity.position.x > -width
    );
  });
}

function handleKeyboard() {
  const speed = 10;
  if (keyIsDown(J_KEY)) {
    // Down
    moveViewPort(createVector(0, -speed));
  }
  if (keyIsDown(K_KEY)) {
    // Up
    moveViewPort(createVector(0, speed));
  }
  if (keyIsDown(H_KEY)) {
    // Left
    moveViewPort(createVector(-speed, 0));
  }
  if (keyIsDown(L_KEY)) {
    // Right
    moveViewPort(createVector(speed, 0));
  }
}

function translateToViewPort() {
  translate(
    -(viewPort.position.x - viewPort.size.x / 2),
    viewPort.position.y + viewPort.size.y / 2
  );
}

function renderBackground() {
  push();
  scale(backgroundImgScale, backgroundImgScale);
  image(backgroundImg, 0, -backgroundImg.height);
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
    leftYAxis = -controller.axes[1];

    player.speed.x = round(leftXAxis, 1) * player.maxSpeed;
    player.speed.y = round(leftYAxis, 1) * player.maxSpeed;

    let offset = createVector(player.size.x / 2 + 4, -player.size.y / 4);
    let laserSpeed = 20;

    if (controller.buttons[R1].pressed && reloading <= 0) {
      reloading = 10;
      laserShot = new Entity2d(laserShotImg);
      laserShot.position = player.position.copy().add(offset);
      laserShot.size = createVector(20, 10);
      laserShot.speed = createVector(laserSpeed, 0);
      laserShot.gravity = createVector(0, 0);
      laserShot.drag_factor = 1;

      entities.push(laserShot);
    }

    // console.log(leftXAxis);
    // console.log(leftYAxis);
  }
}

function enemyAI() {
  // fill("red");
  // strokeWeight(12);
  // line(-width, 0, width, 0);
  // fill("yellow");
  // line(0, -height, 0, height);
  // if (cloneTroupers.position.y >= height || cloneTroupers.position.y <= 0) {
  //   cloneTroupers.speed.y *= -1;
  // }
}

function keyPressed() {
  if (keyCode === D_KEY) {
    debug = !debug;
    if (debug) {
      console.log("Debug mode enabled");
    } else {
      console.log("Debug mode disabled");
    }
  }
}

function moveViewPort(direction) {
  viewPort.position.add(direction);

  let bgWidth = backgroundImg.width * backgroundImgScale;
  let bgHeight = backgroundImg.height * backgroundImgScale;

  viewPort.position.x = constrain(
    viewPort.position.x,
    width / 2,
    bgWidth - width / 2
  );

  viewPort.position.y = constrain(
    viewPort.position.y,
    height / 2,
    bgHeight - height / 2
  );
}

function drawCoordSystem() {
  stroke("red");
  strokeWeight(3);
  // x axis
  line(0, 0, width / 2, 0);
  // y axis
  stroke("green");
  line(0, 0, 0, height / 2);
}
