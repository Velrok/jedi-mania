class Entity2d {
  constructor(image) {
    this.image = image;
    this.position = createVector(0, 0);
    this.speed = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.rotation_speed = 0.0;
    this.rotation = 0;
    this.scale = createVector(1, 1);
  }

  render() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);
    scale(this.scale.x, this.scale.y);
    image(this.image, 0, 0);
    pop();
  }

  update() {
    this.rotation += this.rotation_speed;
    this.position.add(this.speed);
    this.speed.add(this.velocity);
  }
}
