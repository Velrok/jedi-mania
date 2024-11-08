let backgroundImg;

const WIDTH = 1200;
const HEIGHT = 800;

let ewoks = [];

function preload() {}

function makeEwok(no) {
  let ewok = new Entity2d();
  no = no || "01";
  ewok.position = createVector(300, 0);
  ewok.image = loadImage("assets/ewok" + no + ".png");
  ewok.scale = createVector(1 / 10, 1 / 10);
  ewok.rotation_speed = 0.1;
  ewok.velocity = createVector(0.1, 0);

  return ewok;
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);

  backgroundImg = loadImage("assets/desert.jpg");

  ewoks.push(makeEwok("01"));
  ewoks.push(makeEwok("02"));
}

function draw() {
  image(backgroundImg, 0, 0);
  ewoks.forEach((ewok) => {
    ewok.render();
    ewok.update();
  });
}
