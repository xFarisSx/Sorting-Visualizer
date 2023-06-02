myCanvas.height = myCanvas.clientHeight;
myCanvas.width = myCanvas.clientWidth;

const n = 18;
const array = [];
const stringHeight = myCanvas.height * 0.40;
const socks = [];
const offset = myCanvas.width / 4;
const colors = ['#D35400', '#2471A3', '#F39C12',
				'#B2BABB', '#138D75', '#52BE80',
				'#BB8FCE', '#555555', '#bcf60c',
				'#fabebe', '#9a6324', '#54A1D3',
				'#aaffc3', '#808000', '#333333'];

const tweenLength = 120

const spacing = (myCanvas.width - offset) / (n);
for (let i = 0; i < n/2; i++) {
  const t = i/(n/2-1)
  array.push(  lerp(50, 200,t));
  array.push(lerp(50, 200,t));
}

for(let  i = 0; i<array.length;i++){
  const j = Math.floor(Math.random()*array.length);
  [array[i], array[j]] = [array[j], array[i]];
}

for (let i = 0; i < array.length; i++) {
  const x = i * spacing + spacing / 2 + offset / 2;
  const v = x/(myCanvas.width)
  const u = Math.sin(Math.PI*v)
  const y = stringHeight+u*80;
  const height = array[i];
  const t = Math.random()
  const width = lerp(10, 16, t);
  socks[i] = new Sock(x, y, height, width, colors[Math.floor(Math.random()*(colors.length-1)+1)]);
}

const bird = new Bird(socks[0].loc, socks[1].loc, myCanvas.height*0.27, myCanvas.height*0.12, tweenLength)
const moves = bubbleSort(array);
const ctx = myCanvas.getContext("2d");
animate();
function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  ctx.beginPath();
ctx.moveTo(0, stringHeight);
ctx.bezierCurveTo(0, stringHeight,myCanvas.width/2 , stringHeight+170, myCanvas.width, stringHeight);
ctx.stroke();

  let changed = false;
  for (let x = 0; x < socks.length; x++) {
    changed = socks[x].draw(ctx) || changed;
    Physics.update(socks[x].particles, socks[x].segments)
  }

  changed = bird.draw(ctx)||changed

  if (!changed && moves.length > 0) {
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type == "swap") {
      
      socks[i].moveTo(socks[j].loc, tweenLength);
      socks[j].moveTo(socks[i].loc, tweenLength);
      let temp = socks[i];
      socks[i] = socks[j]; 
      socks[j] = temp;
      bird.moveTo(socks[i].loc,socks[j].loc, false, tweenLength)
    } else {
      bird.moveTo(socks[i].loc,socks[j].loc, true, tweenLength)

    }
  }
  requestAnimationFrame(animate);
}
// bubbleSort(array)
function bubbleSort(array) {
  // var swapped = false
  // do{
  //     swapped = false
  //     for(let i = 1; i< array.length;i++){
    //         swapped = false
    //         // moves.push({
      //         //     indices : [i-1, i],
  //         //     type:"comparison"
  //         // })
  //         // if(array[i-1] > array[i]){
    //         //     swapped = true
    //         //     [array[i-1], array[i]] = [array[i], array[i-1]]
    //         //     moves.push({
      //         //         indices : [i-1, i],
      //         //         type:"swap"
      //         //     })
      //         // }
      //     }
      // }while(swapped)
      
      const moves = [];
      let n = array.length
      let left= 1
  let notSorted = true;
  while (notSorted) {
    notSorted = false;
    if((n-left)%2 == 1){
      for (let i = left; i < n; i++) {
        moves.push({
          indices: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          notSorted = true;
          moves.push({
            indices: [i - 1, i],
            type: "swap",
          });
        }
      }
      n--

    } else {
      for (let i = n-1; i >= left; i--) {
        moves.push({
          indices: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          notSorted = true;
          moves.push({
            indices: [i - 1, i],
            type: "swap",
          });
        }
      }
      left++
    }
  }

  return moves;
}
