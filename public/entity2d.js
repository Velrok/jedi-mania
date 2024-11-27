class Entity2d {
  constructor(image, scale = 1) {
    this.tag = "";
    this.image = image;
    this.size = createVector(image.width * scale, image.height * scale);
    this.position = createVector(0, 0);
    this.speed = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.gravity = createVector(0, 1 / 15);
    this.rotation_speed = 0.0;
    this.rotation = 0;
    this.bounce = false;
    this.bounce_factor = 0.3;
    this.drag_factor = 0.99;
    this.maxSpeed = null;
    this.lifeTime = null;
  }

  render(debug = false) {
    push();

    translate(this.position.x, -this.position.y);

    push();
    rotate(this.rotation);
    scale(this.size.x / this.image.width, this.size.y / this.image.height);
    translate(-this.image.width / 2, -this.image.height / 2);
    image(this.image, 0, 0);
    pop();

    if (debug) {
      noFill();
      let halfSize = this.size.copy().mult(0.5);
      stroke("white");
      rect(-halfSize.x, -halfSize.y, this.size.x, this.size.y);

      stroke("blue");
      strokeWeight(2);
      line(0, 0, this.speed.x * 10, this.speed.y * 10);

      stroke("red");
      strokeWeight(2);
      line(
        this.speed.x * 10,
        this.speed.y * 10,
        this.speed.x * 10 + this.acceleration.x * 10,
        this.speed.y * 10 + this.acceleration.y * 10,
      );
    }

    pop();
  }

  update() {
    this.rotation += this.rotation_speed;
    this.rotation_speed *= this.drag_factor;

    if (this.lifeTime) {
      this.lifeTime -= 1;
    }

    if (this.bounce && this.position.y + this.size.y / 2 > 0) {
      this.position.y = -this.size.y / 2;
      this.speed.y *= -this.bounce_factor;
      this.acceleration.y = 0;
    }

    this.acceleration.add(this.gravity);
    this.speed.add(this.acceleration);
    this.speed.mult(this.drag_factor);

    if (this.maxSpeed) {
      this.speed.limit(this.maxSpeed);
    }

    this.position.add(this.speed);

    if (this.levelBoundry) {
      this.position.x = constrain(
        this.position.x,
        this.levelBoundry.topLeft.x,
        this.levelBoundry.bottomRight.x,
      );

      this.position.y = constrain(
        this.position.y,
        this.levelBoundry.bottomRight.y,
        this.levelBoundry.topLeft.y,
      );
    }
  }
}
