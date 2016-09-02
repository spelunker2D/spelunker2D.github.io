// get the canvas context
var canvas = document.getElementById("screen")
var ctx = canvas.getContext("2d")
// Add event handler to load button
var load_button = document.getElementById("load")
load_button.addEventListener("click", load_map)
// Add event handler for cutoff changing
var cutoff = document.getElementById("cutoff")
cutoff.addEventListener("input", load_map)
// Add scrolling
window.addEventListener("keydown", scroll_map)
window.addEventListener("mousemove", mouseMoveHandler, false);
// Map props
var screen_props = { x: canvas.width/2,
                     y: canvas.height/2,
                     width: canvas.width/25,
                     height: canvas.height/25,
                     size: 25,
                     lightX: canvas.width/2,
                     lightY: canvas.height/2,
                     map: null
                   }

// Create map when loaded
load_map();
/*var stone = new Image()
stone.src = "/voxel-pack/PNG/Tiles/stone.png"
stone.addEventListener("load", load_map)*/

function load_map() {
  // Create a map based off of the seed
  var seed = document.getElementById("seed").value
  var cutoff = document.getElementById("cutoff").value
  screen_props.map = create_map(canvas.width, canvas.height, seed, cutoff)
  show_pos()
  requestAnimationFrame(animate)
}

function animate(time) {
  requestAnimationFrame(animate)
  render_map(screen_props.map, screen_props.x, screen_props.y,
             screen_props.width, screen_props.height,
             screen_props.size,
             screen_props.lightX, screen_props.lightY)
}
function create_map(width, height, seed, cutoff) {
  // Function vars
  var map = []
  var pnrg = new Alea(seed)
  var noise = new SimplexNoise(pnrg)
  //var cutoff = 0
  // Loop vars
  var x, y, cur, val
  y = 0
  for (var i = 0; i < height; i++) {
    x = 0
    cur = []
    for (var j = 0; j < width; j++) {
      val = noise.noise2D(x, y)
      if (val > cutoff) {
        cur.push(0) // Open
      } else {
        cur.push(1) // Rock
      }
      x += 0.1
    }
    y += 0.1
    map.push(cur)
  }
  return map
}

function render_map(map, x1, y1, width, height, size, lightX, lightY) {
  var x2 = Math.min(x1 + width, map[0].length)
  var y2 = Math.min(y1 + height, map.length)
  for (var i = y1, y = 0; i < y2; i++, y += size) {
    for (var j = x1, x = 0; j < x2; j++, x += size) {
      if (map[i][j] === 0) {
        ctx.fillStyle = "black"
        ctx.fillRect(x, y, size, size)
      } else {
        ctx.fillStyle = "gray"
        ctx.drawImage(Assets.Tiles.img,
          Assets.Tiles.stone.x, Assets.Tiles.stone.y,
          Assets.Tiles.stone.width, Assets.Tiles.stone.height,
          x, y, size, size)
      }
    }
  }
  darken(0, 0, canvas.width, canvas.height, "black", 0.7)
  ligthenGradient(lightX, lightY, 78)
}

function scroll_map(event) {
  switch (event.keyCode) {
    case 37: screen_props.x = Math.max(screen_props.x - 1, 0); break
    case 38: screen_props.y = Math.max(screen_props.y - 1, 0); break
    case 39: screen_props.x = Math.min(screen_props.x + 1,
                                       screen_props.map[0].length - screen_props.width); break
    case 40: screen_props.y = Math.min(screen_props.y + 1,
                                       screen_props.map.length - screen_props.height); break
    default: return
  }
  show_pos()
  event.preventDefault()
}

function show_pos() {
  document.getElementById("status").innerText =
  "You are at X: " + screen_props.x + ", Y: " + screen_props.y
}

function mouseMoveHandler(e) {
  var w = getComputedStyle(canvas).width;
  var h = getComputedStyle(canvas).height;
  w = w.slice(0, w.length-2)
  h = h.slice(0, h.length-2)
  screen_props.lightX = map_val(e.clientX, 0, w, 0, canvas.width);
  screen_props.lightY = map_val(e.clientY, 0, h, 0, canvas.height);
}

function ligthenGradient(x, y, radius) {
  // Taken from http://gamedev.stackexchange.com/a/105826/90080
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  var rnd = 0//0.05 * Math.sin(1.1 * Date.now() / 1000);
  radius = radius * (1 + rnd);
  var radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  radialGradient.addColorStop(0.0, '#BB9');
  radialGradient.addColorStop(0.2 + rnd, '#AA8');
  radialGradient.addColorStop(0.7 + rnd, '#330');
  radialGradient.addColorStop(0.90, '#110');
  radialGradient.addColorStop(1, '#000');
  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function darken(x, y, w, h, darkenColor, amount) {
  // Taken from http://gamedev.stackexchange.com/a/105826/90080
  ctx.fillStyle = darkenColor;
  ctx.globalAlpha = amount;
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;
}

function map_val(value, istart, istop,  ostart,  ostop) {
  // Adapted from the processing source code
  return ostart + (ostop - ostart) * ((value - istart)
  / (istop - istart));
}
