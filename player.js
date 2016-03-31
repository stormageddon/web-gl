'use strict'

var Player = Player || {};

var xLoc; // X coord of head
var yLoc; // Y coord of head
var tail = [];
var SPEED = 3;
var w = 15;
var h = 15;
var direction;
var r;
var col;
var GROWTH_FACTOR = 10;


var Player = function(x, y, startingDir, color, Renderer) {
  console.log("Created a player", x);
  xLoc = x;
  yLoc = y;
  direction = startingDir
  col = color;
  r = Renderer;
  tail.push({x: xLoc + 10, y: yLoc});
  tail.push({x: xLoc + 20, y: yLoc});
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
  var next = tail[0];

  console.log("tail:", tail);
  for (var i = 0; i < tail.length; i++) {
    if (i === 0) {
      tail[i].x = prevHeadLoc.x;
      tail[i].y = prevHeadLoc.y;
      continue;
    }

    var tmp = tail[i + 1];
    if (!tmp) {
      return;
    }

    tail[i + 1].x = next.x;
    tail[i + 1].y = next.y;

    next = tmp;

  }
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
  console.log("Drawing player", xLoc);
  // Draw head
  r.getContext().fillStyle = col;
  r.getContext().fillRect(xLoc, yLoc, w, h);

  // Draw tail
  for(var i = 0; i < tail.length - 1; i++) {
    console.log("Drawing tail part", i);
    console.log("tail", tail);
    r.getContext().fillRect(tail[i].x, tail[i].y, w, h);
  }
}

document.addEventListener('move', function(e) {
  console.log("e:", e);
  direction = e.detail.toUpperCase();
});

module.exports = Player