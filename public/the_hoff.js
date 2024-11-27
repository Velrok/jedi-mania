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
let levelBoundry;

function preload() {
  playerImg = loadImage("assets/scout_trouper.png");
  cloneTroupersImg = loadImage("assets/clone_troupers.png");
  riderCloneImg = loadImage("assets/rider_clone.png");
  backgroundImg = loadImage("assets/theHoff.png");
  laserShotImg = loadImage("assets/laser_shot_01.png");
  boomImg = loadImage("assets/boom.png");
}

function setup() {
  frameRate(60);

  width = windowWidth * 0.99;
  height = windowHeight * 0.95;

  backgroundImgScale = 1 / 4;

  levelDimensions = createVector(
    backgroundImg.width * backgroundImgScale,
    backgroundImg.height * backgroundImgScale,
  );

  viewPort = {
    size: createVector(width, height),
    position: createVector(width / 2, height / 2),
  };

  levelBoundry = {
    topLeft: createVector(0, levelDimensions.y - 1),
    bottomRight: createVector(levelDimensions.x - 1, 0),
  };

  player = new Entity2d(playerImg, 1 / 10);
  player.position = createVector(player.size.x, player.size.y);
  player.levelBoundry = levelBoundry;
  player.gravity = createVector(0, 0);
  player.maxSpeed = 15;
  entities.push(player);

  createCanvas(width, height);
}

function draw() {
  handleGamepad();
  handleKeyboard();
  updateViewPort();
  enemyAI();
  handleEnemyCollision();
  handleLaserCollision();

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

  if (debug) {
    let fps = frameRate();
    text(fps, 50, 50);
    text(entities.length, 50, 65);
  }
}

function updateViewPort() {
  viewPort.position = player.position.copy();

  viewPort.position.x = constrain(
    viewPort.position.x,
    levelBoundry.topLeft.x + viewPort.size.x / 2,
    levelBoundry.bottomRight.x - viewPort.size.x / 2,
  );

  viewPort.position.y = constrain(
    viewPort.position.y,
    levelBoundry.bottomRight.y + viewPort.size.y / 2,
    levelBoundry.topLeft.y - viewPort.size.y / 2,
  );
}

function filterOutDeadEntities(entities) {
  return entities.filter((entity) => {
    return (
      (entity.lifeTime == null || entity.lifeTime > 0) &&
      !entity.isDead &&
      entity.position.x < width * 2 &&
      entity.position.y < height * 2 &&
      entity.position.y > -height * 2 &&
      entity.position.x > -width * 2
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
    viewPort.position.y + viewPort.size.y / 2,
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
    leftXAxis = controller.axes[0];
    leftYAxis = -controller.axes[1];

    // rightXAxis = controller.axes[2];
    // rightYAxis = -controller.axes[3];

    player.speed.x = round(leftXAxis, 1) * player.maxSpeed;
    player.speed.y = round(leftYAxis, 1) * player.maxSpeed;

    // viewPort.position.x += round(rightXAxis, 1) * 10;
    // viewPort.position.y += round(rightYAxis, 1) * 10;

    if (
      (controller.buttons[R1].pressed ||
        controller.buttons[X_BUTTON].pressed) &&
      reloading <= 0
    ) {
      reloading = 10;
      spawnLaser(player);
    }
  }
}

function handleEnemyCollision() {}

function handleLaserCollision() {
  let lasers = entities.filter((entity) => entity.tag === "laser");
  let enemies = entities.filter((entity) => entity.tag === "enemy");

  lasers.forEach((laser) => {
    enemies.forEach((enemy) => {
      if (laser.position.dist(enemy.position) < enemy.size.mag()) {
        console.log("Hit");
        enemy.isDead = true;
        laser.isDead = true;
        spawnBoom(enemy.position.copy());
      }
    });
  });
}

function spawnBoom(position) {
  boom = new Entity2d(boomImg, 1 / 2);
  boom.position = position;
  boom.gravity = createVector(0, 0);
  boom.lifeTime = 60;
  entities.push(boom);
}

function spawnLaser(player) {
  let offset = createVector(player.size.x / 2 + 4, -player.size.y / 4);
  let laserSpeed = 20;

  laserShot = new Entity2d(laserShotImg);
  laserShot.position = player.position.copy().add(offset);
  laserShot.tag = "laser";
  laserShot.size = createVector(20, 10);
  laserShot.speed = createVector(laserSpeed, 0);
  laserShot.gravity = createVector(0, 0);
  laserShot.drag_factor = 1;

  entities.push(laserShot);
}

function spawnCloneTrouper() {
  enemy = new Entity2d(cloneTroupersImg, 1 / 10);
  enemy.position = createVector(
    levelBoundry.bottomRight.x,
    Math.random() * levelBoundry.topLeft.y,
  );
  enemy.tag = "enemy";
  enemy.speed = createVector(-7, 0);
  enemy.gravity = createVector(0, 0);
  enemy.drag_factor = 1;

  entities.push(enemy);
}

function enemyAI() {
  if (frameCount % 80 === 0) {
    spawnCloneTrouper();
  }
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
  if (keyCode === S_KEY) {
    spawnCloneTrouper();
  }
}

function moveViewPort(direction) {
  viewPort.position.add(direction);

  let bgWidth = backgroundImg.width * backgroundImgScale;
  let bgHeight = backgroundImg.height * backgroundImgScale;

  viewPort.position.x = constrain(
    viewPort.position.x,
    width / 2,
    bgWidth - width / 2,
  );

  viewPort.position.y = constrain(
    viewPort.position.y,
    height / 2,
    bgHeight - height / 2,
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
