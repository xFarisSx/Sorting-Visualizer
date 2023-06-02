class Particle {
  constructor(loc, fixed = false) {
    this.loc = loc;
    this.oldLoc = loc;
    this.fixed = fixed;
  }

  update() {
    if (this.fixed) return;

    let vel = subtract(this.loc, this.oldLoc);
    let newLoc = add(this.loc, vel);
    newLoc = add(newLoc, Physics.G);
    this.oldLoc = this.loc;
    this.loc = newLoc;
  }

  draw(ctx, radius = 5) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(this.loc.x, this.loc.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
