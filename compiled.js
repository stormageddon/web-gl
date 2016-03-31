(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

console.log("Loaded game.js");

var Game = Game || {};
var Renderer = require('./Renderer');
var Player = require('./Player');
var Goal = require('./Goal');
var Input = require('./Input');

var ONE_FRAME_TIME = 1000 / 60;
var renderer = new Renderer();
var running = true;
var player = new Player(50, 200, 'RIGHT', 'green', renderer);

var Game = function() {
  console.log("Created a new Game");
};

Game.prototype.newGame = function() {
  console.log("Starting a new game");
  render();
}

var mainLoop = function(game) {
  if (!running) return;
  tick();
  render();
}

Game.prototype.run = function() {
  setInterval( mainLoop, ONE_FRAME_TIME )
}

var tick = function() {
  var goal = renderer.tick();
  var pLoc = player.tick();
  var wasCollision = checkForCollision(pLoc, goal.location());
  if (wasCollision) {
    player.addPoints(10);
    player.grow();
    goal.regenerate();
    document.getElementById("points").innerHTML = 'Points: ' + player.getPoints();
  }
}

var render = function() {
  renderer.draw();
  player.draw();
}

var checkForCollision = function(pLoc, gLoc) {
  var pX = pLoc.x
  var pY = pLoc.y
  var gX = gLoc.x
  var gY = gLoc.y

  var pSize = player.size()



/*
 * if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y)
 */

  // rect1 = pLoc, rect2 = gLoc

  if (pLoc.x < gLoc.x + 9 &&
      pLoc.x + pSize.w - 1 > gLoc.x &&
      pLoc.y < gLoc.y + 9 &&
      pSize.h + pLoc.y - 1 > gLoc.y) {

      return true
  }

  return false

}

Game.prototype.quit = function() {
  running = false;
}

var endGame = function() {
  alert('Game is over');
}

document.addEventListener('pause', function() {
  running = !running
});

document.addEventListener('Game Over', function() {
  running = false;
  endGame();
});

module.exports = Game
},{"./Goal":2,"./Input":3,"./Player":4,"./Renderer":5}],2:[function(require,module,exports){
'use strict'

var Goal = Goal || {}

var xLoc;
var yLoc;
var w;
var h;
var fillColor = 'red';
var exists = false;

var Goal = function() {
  w = 10;
  h = 10;
}

Goal.prototype.exists = function() {
  return exists;
}

Goal.prototype.generate = function(xBoundary, yBoundary) {
  var xB = xBoundary - w;
  if (xB <= 0) xB = 0;
  var yB = yBoundary - h;
  if (yB >= (120*4)) yB = 120*4 - h;
  xLoc = Math.floor(Math.random() * xBoundary);
  yLoc = Math.floor(Math.random() * yBoundary);
  exists = true;
}

Goal.prototype.location = function() {
  return {x: xLoc, y: yLoc}
}

Goal.prototype.dimensions = function() {
  return {w: w, h: h}
}

Goal.prototype.color = function() {
  return fillColor;
}

Goal.prototype.regenerate = function() {
  exists = false;
}

module.exports = Goal
},{}],3:[function(require,module,exports){
'use strict'

var Input = function() {

}

document.onkeypress = function(e) {

  var event;

  e = e || window.event
  var charCode = e.keyCode

  if (charCode === 112) {
    console.log("pause");
    event = new Event('pause');
  }

  if (charCode === 37 || charCode === 97) { // Left Arrow
    event = new CustomEvent('move', { 'detail': 'left' });
  }

  if (charCode === 38 || charCode === 119) { // Up Arrow
    event = new CustomEvent('move', { 'detail': 'up' });
  }

  if (charCode === 39 || charCode === 100) { // Right Arrow
    event = new CustomEvent('move', { 'detail': 'right' });
  }

  if (charCode === 40 || charCode === 115) { // Down Arrow
    event = new CustomEvent('move', { 'detail': 'down' });
  }

  document.dispatchEvent(event);

}

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict'

console.log("loaded renderer.js");

var Renderer = Renderer || {}

var Renderer = function() {

}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var WIDTH = 160;
var HEIGHT = 120;
var SCALE = 2;

var Goal = require('./Goal');
var goal = new Goal();
var xLoc = 10;
var yLoc = 10;
var w = 100;
var h = 100;
var rot = 0;
var rotDelta = 10;
var col = "red";
var colors = ["red", "blue", "green", "yellow", "black", "pink"];
var pixels = [];

context.canvas.height = HEIGHT*SCALE;
context.canvas.width = WIDTH*SCALE;

context.fillStyle = col

Renderer.prototype.tick = function() {
  if (!goal.exists()) {
    goal.generate(WIDTH * SCALE, HEIGHT * SCALE);
  }
  return goal;
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = goal.color();
  console.log(goal.location());
  var loc = goal.location();
  var size = goal.dimensions();
  console.log("Drawing Goal:", loc.x, loc.y, size.w, size.w);
  context.fillRect(loc.x, loc.y, size.w, size.h);
}

Renderer.prototype.getContext = function() {
  return context;
}

var clear = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

module.exports = Renderer
},{"./Goal":2}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./Goal":2,"./Input":3,"./Player":4,"./Renderer":5,"dup":1}],8:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
var game;

// window makes this targetable outside the bundle
window.startGame = function() {
  game.run();
}

window.drawNewGame = function() {
  var Game = require('./Game');
  game = new Game();
  game.newGame();
}
},{"./Game":1}],11:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./Goal":2,"dup":5}]},{},[6,7,8,9,10,11,12]);
