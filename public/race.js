let backgroundImg;
let lightSpeedImg;

const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;
const J_KEY = 74;
const K_KEY = 75;
const F_KEY = 70;

const X_BUTTON = 0;
const CIRCLE_BUTTON = 1;
const SQUARE_BUTTON = 2;
const TRIANGE_BUTTON = 3;

const L1 = 4;
const L2 = 6; // analog
const R1 = 5;
const R2 = 7; // analog

const DPAD_UP = 12;
const DPAD_down = 13;
const DPAD_left = 14;
const DPAD_right = 15;

const WIDTH = 1200;
const HEIGHT = 900;

let baseLevel = 650;

let atLightSpeed = false;

let scoreBoard = [];

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

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);
  oponents = shuffle(allOponents).slice(0, 2);
  scoreBoard = JSON.parse(localStorage.getItem("scoreBoard")) || [];
  setupGamepad();
}

let winner = "unknown";

function drawImageEntity(imageEntity) {
  image(imageEntity.img, imageEntity.x, imageEntity.y);
}

function drawWinner(winner) {
  if (winner !== "unknown") {
    textSize(100);
    const x = 300;
    const y = 150;
    if (winner === "player") {
      text("🏆 You win! 🏆", x, y);
      const lineHeight = 100;
      textSize(70);
      textFont("Courier New");
      scoreBoard.forEach((score, index) => {
        let entry =
          score.name.padEnd(10, ".") + score.score.toString().padStart(5, "0");
        text(entry, x, y + lineHeight * (index + 1));
      });
    } else {
      text("😞 Too slow. 😞", x, y);
    }
  }
}

function determineWinner() {
  if (winner === "unknown") {
    if (player.x >= WIDTH) {
      console.log("player wins");
      winner = "player";
      let playerName = prompt("Enter your name for the high score board");
      const score = (WIDTH - frameCount) * 10;
      scoreBoard.push({ name: playerName, score: score });
      scoreBoard.sort((a, b) => b.score - a.score);
      while (scoreBoard.length > 5) {
        scoreBoard.pop();
      }
      localStorage.setItem("scoreBoard", JSON.stringify(scoreBoard));
      console.log(scoreBoard);
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

function drawInstructions() {
  textSize(20);
  text("📋Alternate a/s or j/k to race; f to toggle fullscreen", 40, 840);
}

function drawScene() {
  image(backgroundImg, 0, 0);
  drawInstructions();
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
  var gamepads = navigator.getGamepads();
  let controller = gamepads[0]; //controllers[i]

  if (keyIsPressed) {
    if (targetKeySet.includes(keyCode)) {
      player.x += player.speed;
      playerSpeedData.addData(frameCount);
      targetKeySet = targetKeySet === KEY_SET_1 ? KEY_SET_2 : KEY_SET_1;
    }
  } else if (controller && controller.buttons[L1]) {
    let val = controller.buttons[L2].value;
    console.log(val);
    if (val > 0.02) {
      player.x += 13 * val;
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
  // drawGamepad();

  drawScene();
}

let colour; // Instructions: Attach a PS3 controller and press the play button.
// PS3 Gamepad Demo.
let controllers = [];

function setupGamepad() {
  window.addEventListener("gamepadconnected", function (e) {
    gamepadHandler(e, true);
    console.log(
      "Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index,
      e.gamepad.id,
      e.gamepad.buttons.length,
      e.gamepad.axes.length
    );
  });
  window.addEventListener("gamepaddisconnected", function (e) {
    console.log(
      "Gamepad disconnected from index %d: %s",
      e.gamepad.index,
      e.gamepad.id
    );
    gamepadHandler(e, false);
  });
}

function gamepadHandler(event, connecting) {
  let gamepad = event.gamepad;
  if (connecting) {
    print("Connecting to controller " + gamepad.index);
    controllers[gamepad.index] = gamepad;
  } else {
    delete controllers[gamepad.index];
  }
}

function drawGamepad() {
  var gamepads = navigator.getGamepads();

  for (let i in controllers) {
    let controller = gamepads[i]; //controllers[i]
    if (controller.buttons) {
      for (let btn = 0; btn < controller.buttons.length; btn++) {
        let val = controller.buttons[btn];
        if (buttonPressed(val)) {
          console.log("button pressed", btn);
        }
      }
    }
    // if (controller.axes) {
    //   let axes = controller.axes;
    //   for (let axis = 0; axis < axes.length; axis++) {
    //     let val = controller.axes[axis];
    //     if (val !== 0) {
    //       console.log("axis", axis, val);
    //     }
    //   }
    // }
  }
}

function buttonPressed(b) {
  if (typeof b == "object") {
    return b.pressed; // binary
  }
  return b > 0.9; // analog value
}
