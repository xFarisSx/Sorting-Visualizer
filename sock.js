class Sock {
  constructor(x, y, height, width, color) {
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color
    this.height = height;
    this.queue = [];
    this.loc = { x: this.x, y: this.y };
    this.blockHeight = 10;
    this.particles = [];
    this.segments = [];
    this.addParticlesAndSegments();
    // this.addSegments();
  }

  addParticlesAndSegments() {
    const { x, y } = this.loc;
    const left = x - this.width / 2;
    const right = x + this.width / 2;
    const bottom = y + this.height;
    this.particles.push(new Particle(this.loc, true));
    let curHeight = 0;
    let p1;
    let p2;
    let oldLeft;
    let oldRight;
    while (curHeight < this.height) {
      if (p1 && p2) {
        oldLeft = p1;
        oldRight = p2;
      }
      p1 = new Particle({ x: left, y: this.loc.y + curHeight }, false);
      p2 = new Particle({ x: right, y: this.loc.y + curHeight }, false);
      curHeight += this.blockHeight;
      if(curHeight>=this.height){
        const lastP = p2
        lastP.loc.x += this.blockHeight*2
        lastP.loc.y += this.blockHeight*0.1
        const secondLastP = p1
        // secondLastP.loc.x += this.blockHeight*2
        secondLastP.loc.y -= this.blockHeight*0.2
        const secondSecondLastP = this.particles[this.particles.length -4]
        const secondSecondSecondLastP = this.particles[this.particles.length -3]
        if(this.particles.length >3){
          secondSecondLastP.loc.y -= this.blockHeight/2
          this.segments.push(
            new Segment(lastP, this.particles[this.particles.length - 4])
            );
          }
          
        }
      this.particles.push(p1);
      this.particles.push(p2);
      let araS = new Segment(p1, p2);
      if (oldLeft && oldRight) {
        this.segments.push(new Segment(oldLeft, p1));
        this.segments.push(new Segment(oldRight, p2));
      } else {
        this.segments.push(new Segment(this.particles[0], p1));
        this.segments.push(new Segment(this.particles[0], p2));
      }
      this.segments.push(araS);
    }
  }
  
  moveTo(newLoc, frameCount = 120) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      const w = t*1.5-0.5
      this.queue.push(vLerp(this.loc, newLoc, t));
    }
  }

  draw(ctx) {
    let changed = false;
    if (this.queue.length > 0) {
      this.loc = this.queue.shift();
      this.particles[0].loc = this.loc;
      changed = true;
    }
    
    const ps = this.particles

    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.strokeStyle = "rgba(0,0,180,0.9)"
    ctx.moveTo(ps[0].loc.x, ps[0].loc.y-this.width*0.7)
    ctx.lineTo(ps[0].loc.x+this.width*0.4, ps[0].loc.y+this.width*0.3)
    ctx.stroke()

    ctx.strokeStyle = this.color
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.fillStyle = this.color
    // ctx.strokeStyle = this.color
    ctx.moveTo(ps[0].loc.x,ps[0].loc.y )
    for(let i = 2; i<ps.length;i+=2){
      ctx.lineTo(ps[i].loc.x,ps[i].loc.y)
      
    }
    for(let i = ps.length-2; i>=0;i-=2){
      ctx.lineTo(ps[i].loc.x,ps[i].loc.y)
      
    }
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 5
    ctx.stroke();
    ctx.lineWidth = 1

    ctx.setLineDash([2,2])
    ctx.strokeStyle = "rgba(0,0,0,0.5)"
    ctx.stroke()
    ctx.setLineDash([])

    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.strokeStyle = "rgba(0,0,0,0.6)"
    ctx.moveTo(ps[0].loc.x, ps[0].loc.y-this.width*0.7)
    ctx.lineTo(ps[0].loc.x, ps[0].loc.y+this.width*0.3)
    ctx.stroke()
    
    // for (let i = 0; i < this.particles.length; i++) {
    //     this.particles[i].draw(ctx);
    //   }
    //   for (let i = 0; i < this.segments.length; i++) {
    //       this.segments[i].draw(ctx);
    //     }
        return changed;
      }
    }
