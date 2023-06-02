class Bird {
  constructor(lFoot, rFoot, headY, height, frameCount) {
    this.lFoot = lFoot;
    this.rFoot = rFoot;
    this.height = height;
    this.head = { x: average(lFoot, rFoot).x, y: headY };
    this.legLength = distance(this.lFoot, this.head) *0.8;
    this.lKnee = average(this.lFoot, this.head);
    this.rKnee = average(this.rFoot, this.head);
    this.queue = [];
    this.frameCount = frameCount;
    this.#update();
  }

  moveTo(lFoot, rFoot, doBounce = false, frameCount = 120) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      const u = Math.sin(t * Math.PI);
      // const u = easeInOutBack(t)
      const w = doBounce ? t * 1.5 - 0.5 : t;
      const frame = {
        lFoot: vLerp(this.lFoot, lFoot, Math.max(0, w)),
        rFoot: vLerp(this.rFoot, rFoot, Math.max(0, w)),
      };
      if (doBounce) {
        frame.lFoot.y -= Math.max(0, w) * u * this.legLength * 0.3;
        frame.rFoot.y -= Math.max(0, w) * u * this.legLength * 0.3;
      }
      frame["head"] = average(frame.lFoot, frame.rFoot);
      const v = easeInOutBack(t);
      frame["head"].y -= this.height;
      if (doBounce) {
        frame["head"].y -= v * this.legLength * 0.1;
      }
      // (frame.lFoot.y-u*10)
      this.queue.push(frame);
    }

    if (doBounce) {
      this.queue.push(this.queue[this.queue.length - 1]);
      this.queue.push(this.queue[this.queue.length - 1]);
      this.queue.push(this.queue[this.queue.length - 1]);
      this.queue.push(this.queue[this.queue.length - 1]);
    }
  }

  #update() {
    let changed = false;
    if (this.queue.length > 0) {
      let info = this.queue.shift();
      this.lFoot = info.lFoot;
      this.rFoot = info.rFoot;
      this.head = info.head;
      changed = true;
    }
    this.head = { x: average(this.lFoot, this.rFoot).x, y: this.head.y };

    if (this.legLength) {
      this.lKnee = this.#getKnee(this.head, this.lFoot, "l");
      this.rKnee = this.#getKnee(this.head, this.rFoot, "r");
    }
    return changed;
  }

  #getKnee(head, foot, type) {
    const center = average(foot, head);
    const angle = Math.atan2(foot.y - head.y, foot.x - head.x);
    const dist = distance(foot, head);
    const height = Math.sqrt(this.legLength ** 2 - dist ** 2);
    const offsetAngle = angle + Math.PI / 2;
    if (type == "l") {
      return {
        x: center.x + Math.cos(offsetAngle) * height,
        y: center.y + Math.sin(offsetAngle) * height,
      };
    } else {
      return {
        x: center.x - Math.cos(offsetAngle) * height,
        y: center.y - Math.sin(offsetAngle) * height,
      };
    }
  }

  #drawFeathers(ctx, center, radius, spread=1,angle=Math.PI*2) {
    for (let i = 0; i <= 3; i++) {
      const t = i /3;
      const u = Math.sin(t * Math.PI);
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.ellipse(
        center.x -Math.cos(angle)* radius*spread * (t - 1),
        center.y - Math.sin(angle)*radius * (1.32 + u * 0.5),
        radius * 0.22,
        radius * 0.72,
        (1- t)*spread+angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    }
    for (let i = 0; i <= 3; i++) {
      const t = i / 3;
      const u = Math.sin(t * Math.PI);
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.ellipse(
        center.x +Math.cos(angle)* radius*spread * (t - 1),
        center.y + Math.sin(angle)*radius * (1.32 + u * 0.5),
        radius * 0.22,
        radius * 0.72,
        (-1+ t)*spread+angle,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  #drawHead(ctx) {
    // head
    const radius = 25;
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "darkblue";
    ctx.beginPath();
    ctx.arc(this.head.x, this.head.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.save()
    ctx.translate(this.head.x, this.head.y-radius*4.5/3)
    this.#drawFeathers(ctx, {x:0, y:0}, radius, 1)
    ctx.restore()
    ctx.save()
    ctx.translate(this.head.x-radius*4.5/3, this.head.y)
    ctx.rotate(-Math.PI/2)
    this.#drawFeathers(ctx, {x:0, y:0}, radius, 1/1.6)
    ctx.restore()
    ctx.save()
    ctx.translate(this.head.x+radius*4.5/3, this.head.y)
    ctx.rotate(Math.PI/2)
    this.#drawFeathers(ctx, {x:0, y:0}, radius,  1/1.6)
    ctx.restore()
    
    // beak
    ctx.fillStyle = "orange";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.head.x - radius * 0.32, this.head.y + radius * 0.3);
    ctx.lineTo(this.head.x, this.head.y + radius * 1.5);
    ctx.lineTo(this.head.x + radius * 0.32, this.head.y + radius * 0.3);
    ctx.fill();
    ctx.stroke();

    // Eye1
    ctx.beginPath();
    const eyeSize = radius * 0.8;
    ctx.fillStyle = "white";
    ctx.ellipse(
      this.head.x - radius * 0.34,
      this.head.y,
      eyeSize * 0.4,
      eyeSize * 0.5,
      -0.3,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.ellipse(
      this.head.x - radius * 0.22,
      this.head.y + radius * 0.1,
      eyeSize * 0.2,
      eyeSize * 0.2,
      -0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Eye2
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.ellipse(
      this.head.x + radius * 0.34,
      this.head.y,
      eyeSize * 0.4,
      eyeSize * 0.5,
      0.3,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "black";
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.ellipse(
      this.head.x + radius * 0.22,
      this.head.y + radius * 0.1,
      eyeSize * 0.2,
      eyeSize * 0.2,
      0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  #drawFoot(ctx, knee, foot) {
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(knee.x, knee.y);
    ctx.lineTo(foot.x, foot.y);
    const ankle = vLerp(knee, foot, 0.7);
    const angle = Math.atan2(foot.y - knee.y, foot.x - knee.x);
    const dist = distance(ankle, foot);
    const finger1 = {
      x: ankle.x + dist * Math.cos(angle + 0.5),
      y: ankle.y + dist * Math.sin(angle + 0.5),
    };
    const finger2 = {
      x: ankle.x + dist * Math.cos(angle - 0.5),
      y: ankle.y + dist * Math.sin(angle - 0.5),
    };
    ctx.moveTo(ankle.x, ankle.y);
    ctx.lineTo(finger1.x, finger1.y);
    ctx.moveTo(ankle.x, ankle.y);
    ctx.lineTo(finger2.x, finger2.y);
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(knee.x, knee.y);
    ctx.lineTo(foot.x, foot.y);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    ctx.setLineDash([2, 8]);
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.lineWidth = 1;
  }

  draw(ctx) {
    let changed = this.#update();

    this.#drawFoot(ctx, this.rKnee, this.rFoot);
    this.#drawFoot(ctx, this.lKnee, this.lFoot);

    this.#drawHead(ctx);
    return changed;
  }
}
