function lerp(a, b, t) {
  return a + (b - a) * t;
}

function vLerp(a, b, t) {
  const result = {};
  for (let attr in a) {
    if (b[attr]) {
      result[attr] = lerp(a[attr], b[attr], t);
    }
  }
  return result;
}

function add(a, b) {
  const result = {};
  for (let attr in a) {
    result[attr] = a[attr] + b[attr];
  }
  return result;
}
function subtract(a, b) {
  const result = {};
  for (let attr in a) {
    result[attr] = a[attr] - b[attr];
  }
  return result;
}
function average(a, b) {
  const result = {};
  for (let attr in a) {
    result[attr] = (a[attr] + b[attr]) / 2;
  }
  return result;
}
function magnitude(a) {
  let len = 0;
  for (let attr in a) {
    len += a[attr] * a[attr];
  }
  len = Math.sqrt(len);
  return len;
}
function normalize(a) {
  return scale(a, 1 / magnitude(a));
}
function scale(a, s) {
  const result = {};
  for (let attr in a) {
    result[attr] = a[attr] * s;
  }
  return result;
}
function distance(a, b) {
  return magnitude(subtract(a, b));
}

function easeInOutBack(x) {
  const f = Math.sin(x*Math.PI)
  const t  = 4.5
  const g = Math.sin((x+t)*Math.PI*2)

  return (f+g*2)/4
}
