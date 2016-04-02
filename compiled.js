(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var Game = Game || {};
var Renderer = require('./Renderer');
var Player = require('./Player');
var Goal = require('./Goal');
var Input = require('./Input');

var ONE_FRAME_TIME = 60;
var renderer; // = new Renderer();
var running; // = false;
var player; // = new Player(200, 200, 'RIGHT', 'green', renderer);

var Game = function() {
  renderer = new Renderer();
  running = false;
  if (player) {
    player.reset();
  }
  document.getElementById("points").innerHTML = 'Points: 0';
  player = new Player(200, 200, 'RIGHT', '#1ec503', renderer);
};

Game.prototype.newGame = function() {
  renderer.clear();
  render()
}

var mainLoop = function(game) {
  if (!running) return;
  tick();
  render();
}

var runIntervalID;

Game.prototype.run = function() {
  runIntervalID = setInterval( mainLoop, ONE_FRAME_TIME );
  running = true;
  document.getElementById("startBtn").disabled = true
}

var tick = function() {
  var goal = renderer.tick(player.getSnake());
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

// Checks for collision with Goal
var checkForCollision = function(pLoc, gLoc) {
  return pLoc.x === gLoc.x && pLoc.y === gLoc.y;
}

Game.prototype.quit = function() {
  running = false;
}

var endGame = function() {
  if (running === true) {
    alert('Game is over');
    clearInterval(runIntervalID);
  }
  document.getElementById("startBtn").disabled = false;
  return;
}

document.addEventListener('pause', function() {
  if (running) {
    // Pause the game
    renderer.drawPause();
  }
  running = !running
});

document.addEventListener('Game Over', function() {
  endGame();
  running = false;
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

  return {x: xLoc, y: yLoc};
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
  var charCode = e.keyCode || e.which

  if (charCode === 80) {
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

  if (event) {
    document.dispatchEvent(event);
  }

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
  if (snake.length > 0) return;  // Hack to fix double loading of Player
  xLoc = x;
  yLoc = y;
  direction = startingDir
  col = color;
  r = Renderer;

  var length = 4;
  for (var i = length; i >= 0; i--) {
    snake.push({x: i, y: 0});
  }
}

Player.prototype.reset = function() {
  points = 0;
  direction = 'RIGHT';
  snake = [];
}

Player.prototype.getSnake = function() {
  return snake;
}

Player.prototype.addPoints = function(numPoints) {
  points += numPoints;
}

Player.prototype.getPoints = function() {
  return points;
}

var move = function() {
  if( direction === 'RIGHT' ) {
    snake[0].x++;
    if(snake[0].x > (canvas.width / w) - 1) document.dispatchEvent( new Event('Game Over'))
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
    if(snake[0].y > (canvas.height / h) - 1) document.dispatchEvent( new Event('Game Over'))
  }

  moveSnake();

  for (var i = 2; i < snake.length; i++) {
    if (checkForCollision(snake[0], snake[i])) document.dispatchEvent( new Event('Game Over') );
  }
}

var checkForCollision = function(head, tailPiece) {

  if (head.x === tailPiece.x && head.y === tailPiece.y) return true;
  return false

}

var moveSnake = function() {
  var snakeX = snake[0].x;
  var snakeY = snake[0].y;

  var tail = snake.pop();
  tail.x = snakeX;
  tail.y = snakeY;

  snake.unshift(tail);
}


Player.prototype.size = function() {
  return {w: w, h: h};
}

Player.prototype.grow = function() {
  var tail;
  tail = {x: snake[0].x, y: snake[0].y};
  snake.push(tail);
}

Player.prototype.tick = function() {
  move();
  return snake[0];
}

Player.prototype.draw = function() {
   r.getContext().fillStyle = col;

  // Draw snake
  for(var i = 0; i < snake.length; i++) {
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

var validGoalLoc = function(goal, snake) {
  for (var i = 0; i < snake.length; i++) {
    if (goal.x === snake[i].x && goal.y === snake[i].y) return false;
  }
  return true;
}

Renderer.prototype.tick = function(snake) {
  if (!goal.exists()) {
    var goalLoc = goal.generate(44, 44);
    while (!validGoalLoc(goalLoc, snake)) {
      goalLoc = goal.generate(44, 44);
    }
  }
  return goal;
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = goal.color();
  var loc = goal.location();
  var size = goal.dimensions();
  context.fillRect(loc.x * size.w, loc.y * size.h, size.w, size.h);
}

Renderer.prototype.drawPause = function() {
  context.fillStyle = "#ffffff";
  context.font = "20px Georgia";
  context.fillText("Press 'P' to unpause", WIDTH*SCALE / 4, HEIGHT*SCALE / 2);
  context.fillStyle = "#000000";
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
var Game = require('./Game');
var game;

// window makes this targetable outside the bundle
window.startGame = function() {
  game = null;
  game = new Game();
  game.newGame();
  game.run();
}

window.drawNewGame = function() {
  game = new Game();
  game.newGame();
}
},{"./Game":1}],11:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"./Goal":2,"dup":5}]},{},[6,7,8,9,10,11,12]);
