class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.oldDistance = distance(this.p1.loc, this.p2.loc);
  }
  draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.p1.loc.x, this.p1.loc.y);
      ctx.lineTo(this.p2.loc.x, this.p2.loc.y);
      ctx.strokeStyle = "orange";
      ctx.stroke();
      ctx.restore();
    }
    update() {
      this.newDistance = distance(this.p1.loc, this.p2.loc);
      const diff = subtract(this.p1.loc, this.p2.loc)
      const norm = normalize(diff)
    const move = (this.newDistance - this.oldDistance)
    if (this.p1.fixed && !this.p2.fixed ) {
      this.p2.loc = add(this.p2.loc, scale(norm, move));
    } else if (this.p2.fixed && !this.p1.fixed ) {
      this.p1.loc = add(this.p1.loc,scale(norm,-move));
    } else if(!this.p1.fixed && !this.p2.fixed ) {
      // console.log(this.p1.loc)
      this.p1.loc = add(this.p1.loc, scale(norm,-move/2));
      this.p2.loc = add(this.p2.loc, scale(norm, move/2));
    }
  }
}
