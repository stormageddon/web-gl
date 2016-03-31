'use strict'

var Player = Player || {};

var xLoc; // X coord of head
var yLoc; // Y coord of head
var tail = [];
var SPEED = 3;
var w = 10;
var h = 10;
var direction;
var r;
var col;
var GROWTH_FACTOR = 100;
var points = 0;


var Player = function(x, y, startingDir, color, Renderer) {
  xLoc = x;
  yLoc = y;
  direction = startingDir
  col = color;
  r = Renderer;
  tail.push({x: xLoc + 10, y: yLoc});
  tail.push({x: xLoc + 20, y: yLoc});
}

Player.prototype.addPoints = function(numPoints) {
  points += numPoints;
}

Player.prototype.getPoints = function() {
  return points;
}

var move = function() {
  var prevHeadLoc = {x: xLoc, y: yLoc};
  if( direction === 'RIGHT' ) {
    xLoc += SPEED;
    if(xLoc + w - 5 > canvas.width) document.dispatchEvent( new Event('Game Over'))
  }
  if( direction === 'LEFT' ) {
    xLoc -= SPEED;
    if(xLoc < -5) document.dispatchEvent(new Event('Game Over'));
  }
  if( direction === 'UP' ) {
    yLoc -= SPEED;
    if(yLoc < -5) document.dispatchEvent(new Event('Game Over'));
  }
  if( direction === 'DOWN' ) {
    yLoc += SPEED;
    if(yLoc + h - 5 > canvas.height) document.dispatchEvent( new Event('Game Over'))
  }

  moveTail(prevHeadLoc);
}

var moveTail = function(prevHeadLoc) {
  var t = tail.pop();
  t.x = prevHeadLoc.x;
  t.y = prevHeadLoc.y;

  tail.unshift(t);
}


Player.prototype.size = function() {
  return {w: w, h: h};
}

Player.prototype.grow = function() {
  if (tail.length === 0) {
    tail.push ({ x: xLoc + GROWTH_FACTOR, y: yLoc + GROWTH_FACTOR });
    return;
  }
  var tailEnd = tail[tail.length - 1]
  var newCoord = { x: tailEnd.x + GROWTH_FACTOR, y: tailEnd.y + GROWTH_FACTOR }
  tail.push(newCoord);
}

Player.prototype.tick = function() {
  move();
  return {x: xLoc, y: yLoc};
}

Player.prototype.draw = function() {
  // Draw head
  r.getContext().fillStyle = col;
  r.getContext().fillRect(xLoc, yLoc, w, h);

  // Draw tail
  for(var i = 0; i < tail.length - 1; i++) {
    r.getContext().fillRect(tail[i].x, tail[i].y, w, h);
  }
}

document.addEventListener('move', function(e) {
  var newDirection = e.detail.toUpperCase();

  // Do no allow 180 changes
  if ( (direction === 'UP' && newDirection === 'DOWN')
       || (direction === 'DOWN' && newDirection === 'UP')
       || (direction === 'LEFT' && newDirection === 'RIGHT')
       || (direction === 'RIGHT' && newDirection === 'LEFT')
  ) {
    return;
  }
  direction = e.detail.toUpperCase();
});

module.exports = Player