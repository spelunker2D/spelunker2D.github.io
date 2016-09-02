(function(){
var tiles = new Image();
tiles.src = "/assets/spritesheet_tiles.png";
var chars = new Image();
chars.src = "/assets/spritesheet_characters.png";
var items = new Image();
chars.src = "/assets/spritesheet_items.png";
window.Assets = {
  Tiles: {
    img: tiles,
    stone: {
      x: 260,
      y: 650,
      width: 128,
      height: 128
    }
  }
}
})()
