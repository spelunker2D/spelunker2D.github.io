// get the canvas context
var canvas = document.getElementById("screen")
var ctx = canvas.getContext("2d")
// Add event handler to load button
var load_button = document.getElementById("load")
load_button.addEventListener("click", draw_map)

function draw_map() {
  // Create a map based off of the seed
  console.log("Drawing map...")
  var seed = document.getElementById("seed").value
  var map = create_map(canvas.width, canvas.height, seed, 0.35)
  render_map(map)
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

function render_map(map) {
  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) {
        ctx.fillStyle = "white"
      } else {
        ctx.fillStyle = "black"
      }
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

function map_val(value, istart, istop,  ostart,  ostop) {
  // Adapted from the processing source code
  return ostart + (ostop - ostart) * ((value - istart)
  / (istop - istart));
}
