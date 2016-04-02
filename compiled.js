(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

console.log("Loaded game.js");

var Game = Game || {};
var Renderer = require('./Renderer');
var Player = require('./Player');
var Goal = require('./Goal');
var Input = require('./Input');

var ONE_FRAME_TIME = 60;
var renderer = new Renderer();
var running = true;
var player = new Player(200, 200, 'RIGHT', 'green', renderer);

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
  console.log("TICK");
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


  return pLoc.x === gLoc.x && pLoc.y === gLoc.y;

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

  var x = Math.floor(Math.random()*(xBoundary));
  var y = Math.floor(Math.random()*(yBoundary));

  xLoc = x;
  yLoc = y;
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

document.onkeydown = function(e) {

  var event;

  e = e || window.event
  var charCode = e.keyCode

  if (charCode === 112) {
    console.log("pause");
    event = new Event('pause');
  }

  if (charCode === 37) { // Left Arrow
    event = new CustomEvent('move', { 'detail': 'left' });
  }

  if (charCode === 38) { // Up Arrow
    event = new CustomEvent('move', { 'detail': 'up' });
  }

  if (charCode === 39) { // Right Arrow
    event = new CustomEvent('move', { 'detail': 'right' });
  }

  if (charCode === 40) { // Down Arrow
    event = new CustomEvent('move', { 'detail': 'down' });
  }

  document.dispatchEvent(event);

}

},{}],4:[function(require,module,exports){
'use strict'

var Player = Player || {};

var xLoc; // X coord of head
var yLoc; // Y coord of head
var snake = [];  // Contains snake cells
var SPEED = 2;
var w = 10;
var h = 10;
var direction;
var r;
var col;
var points = 0;


var Player = function(x, y, startingDir, color, Renderer) {
  xLoc = x;
  yLoc = y;
  direction = startingDir
  col = color;
  r = Renderer;

  snake = [];

  var length = 5;
  for (var i= length; i >= 0; i--) {
    snake.push({x: i, y: 0});
  }

}

Player.prototype.addPoints = function(numPoints) {
  points += numPoints;
}

Player.prototype.getPoints = function() {
  return points;
}

var move = function() {
  var head = snake[0];
  if( direction === 'RIGHT' ) {
    snake[0].x++;
    if(snake[0].x > canvas.width / w) document.dispatchEvent( new Event('Game Over'))
  }
  if( direction === 'LEFT' ) {
    snake[0].x--;
    if(snake[0].x < 0) document.dispatchEvent(new Event('Game Over'));
  }
  if( direction === 'UP' ) {
    snake[0].y--;
    if(snake[0].y < 0) document.dispatchEvent(new Event('Game Over'));
  }
  if( direction === 'DOWN' ) {
    snake[0].y++;
    if(snake[0].y > canvas.height / h) document.dispatchEvent( new Event('Game Over'))
  }

  moveSnake();

  for (var i = 1; i < snake.length; ++i) {
    if (checkForCollision(snake[0], snake[i])) document.dispatchEvent( new Event('Game Over') );
  }
}


var checkForCollision = function(head, tailPiece) {
  console.log("Snake:", snake);
  console.log("HEad:", head);
  console.log("Tail piece:", tailPiece);

//  if (head.x === tailPiece.x && head.y === tailPiece.y) return true;

/*  if (head.x < tailPiece.x + 11 &&
      head.x + w > tailPiece.x &&
      head.y - 1< tailPiece.y + 11 &&
      h + head.y - 1 > tailPiece.y) {

      return true
  }*/

//  if (head.x + SPEED === tailPiece.x && head.y + SPEED === tailPiece.y) return true;

  return false

}

var moveSnake = function() {
  console.log("MOVING SNAKE", snake);
  var snake_head = snake[0]
  var tail = snake.pop();
  tail.x = snake_head.x;
  tail.y = snake_head.y;

  snake.unshift(tail);

  console.log("MOVED SNAKE:", snake);
}


Player.prototype.size = function() {
  return {w: w, h: h};
}

Player.prototype.grow = function() {
  var tail;
  /*if (direction === 'RIGHT') {
    tail = {x: snake[0].x - w, y: snake[0].y};
  }
  if (direction === 'LEFT') {
    tail = {x: snake[0].x + w, y: snake[0].y};
  }
  if (direction === 'UP') {
    tail = {x: snake[0].x, y: snake[0].y + h};
  }
  if (direction === 'DOWN') {
    tail = {x: snake[0].x + w, y: snake[0].y - h};
  }*/

  tail = {x: snake[0].x, y: snake[0].y};

  console.log("Head:", snake[0]);
  console.log("New tail:", tail);

  //snake.unshift(tail);

  snake.push(tail);

  console.log("NEW SNAKE:", snake);
}

Player.prototype.tick = function() {
  move();
  console.log("RETURNING PLAYER HEAD POSITION:", snake[0]);
  return snake[0]; //{x: xLoc, y: yLoc};
}

Player.prototype.draw = function() {
   r.getContext().fillStyle = col;

  // Draw snake
  for(var i = 0; i < snake.length; i++) {
    console.log('draw snake part');
    r.getContext().fillRect((snake[i].x * w), snake[i].y * h, w, h);
    r.strokeStyle = 'white';
    r.getContext().strokeRect(snake[i].x * w, snake[i].y * h, w, h);
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
    return
  }

  setTimeout( function() { direction = e.detail.toUpperCase(); return; }, 20 );
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

var WIDTH = 450;
var HEIGHT = 450;
var SCALE = 1;

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
    goal.generate(40, 40);
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
  context.fillRect(loc.x * size.w, loc.y * size.h, size.w, size.h);
}

Renderer.prototype.getContext = function() {
  return context;
}

Renderer.prototype.clear = function() {
  clear();
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
