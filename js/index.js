// get the canvas context
var canvas = document.getElementById("screen")
var ctx = canvas.getContext("2d")
// Add event handler to load button
var load_button = document.getElementById("load")
load_button.addEventListener("click", load_map)
// Add scrolling
window.addEventListener("keydown", scroll_map)
// Map props
var screen_props = { x: canvas.width/2,
                     y: canvas.height/2,
                     width: canvas.width/25,
                     height: canvas.height/25,
                     size: 25,
                     map: null
                   }

// Create map when loaded
load_map()

function load_map() {
  // Create a map based off of the seed
  var seed = document.getElementById("seed").value
  screen_props.map = create_map(canvas.width, canvas.height, seed, 0.35)
  render_map(screen_props.map, screen_props.x, screen_props.y,
             screen_props.width, screen_props.height,
             screen_props.size)
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

function render_map(map, x1, y1, width, height, size) {
  var x2 = x1 + width
  var y2 = y1 + height
  for (var i = y1, y = 0; i < y2; i++, y += size) {
    for (var j = x1, x = 0; j < x2; j++, x += size) {
      if (map[i][j] === 0) {
        ctx.fillStyle = "black"
      } else {
        ctx.fillStyle = "gray"
      }
      ctx.fillRect(x, y, size, size)
    }
  }
}

function scroll_map(event) {
  switch (event.keyCode) {
    case 37: screen_props.x = Math.max(screen_props.x - 1, 0); break
    case 38: screen_props.y = Math.max(screen_props.y - 1, 0); break
    case 39: screen_props.x = Math.min(screen_props.x + 1, screen_props.map[0].length); break
    case 40: screen_props.y = Math.min(screen_props.y + 1, screen_props.map.length); break
    default: return
  }
  event.preventDefault()
  render_map(screen_props.map, screen_props.x, screen_props.y,
             screen_props.width, screen_props.height,
             screen_props.size)
}

function map_val(value, istart, istop,  ostart,  ostop) {
  // Adapted from the processing source code
  return ostart + (ostop - ostart) * ((value - istart)
  / (istop - istart));
}
