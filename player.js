'use strict'

var Player = Player || {};

var xLoc;
var yLoc;
var SPEED = 20;
var w = 100;
var h = 100;
var r;
var col;

var Player = function(x, y, color, Renderer) {
  console.log("Created a player", x);
  xLoc = x;
  yLoc = y;
  col = color;
  r = Renderer;
}

Player.prototype.tick = function() {

}

Player.prototype.draw = function() {
  console.log("Drawing player", xLoc);
  r.getContext().fillStyle = col;
  r.getContext().fillRect(xLoc, yLoc, w, h);
}

document.addEventListener('move', function(e) {
  console.log("e:", e);
  if (e.detail.toUpperCase() === 'LEFT') {
    console.log('left')
    xLoc -= SPEED;
    if(xLoc < 0) xLoc = 0;
  }

  if (e.detail.toUpperCase() === 'UP') {
    yLoc -= SPEED;
    if(yLoc < 0) yLoc = 0;
  }

  if (e.detail.toUpperCase() === 'RIGHT') {
    xLoc = xLoc + SPEED;
    if(xLoc + w > canvas.width) xLoc = canvas.width - w;
  }

  if (e.detail.toUpperCase() === 'DOWN') {
    yLoc += SPEED;
    if(yLoc + h > canvas.height) yLoc = canvas.height - h;
  }
});

module.exports = Player