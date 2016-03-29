(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

console.log("Loaded game.js");

var Game = Game || {};
var Renderer = require('./Renderer');
var Player = require('./Player');
var Input = require('./Input');

var ONE_FRAME_TIME = 1000 / 60;
var renderer = new Renderer();
var running = true;
var player = new Player(200, 200, 'green', renderer);

var Game = function() {
  console.log("Created a new Game");
};

Game.prototype.newGame = function() {
  console.log("Starting a new game");

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
  console.log("Tick");
  renderer.tick();
  player.tick();
}

var render = function() {
  console.log("Render");
  renderer.draw();
  player.draw();
}

Game.prototype.quit = function() {
  running = false;
}

document.addEventListener('pause', function() {
  running = !running
});

module.exports = Game
},{"./Input":2,"./Player":3,"./Renderer":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict'

console.log("loaded renderer.js");

var Renderer = Renderer || {}

var Renderer = function() {

}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var SPEED = .5;
var WIDTH = 160;
var HEIGHT = 120;
var SCALE = 4;


var xLoc = 10
var yLoc = 10
var w = 100
var h = 100
var rot = 0;
var rotDelta = 10;
var col = "red"
var colors = ["red", "blue", "green", "yellow", "black", "pink"]
var pixels = []

context.canvas.height = HEIGHT*SCALE;
context.canvas.width = WIDTH*SCALE;

context.fillStyle = col

Renderer.prototype.tick = function() {
  xLoc += SPEED;
  col = colors[Math.floor(Math.random() * colors.length)]
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = col
  context.fillRect(xLoc, yLoc, w, h);
}

Renderer.prototype.getContext = function() {
  return context;
}

var clear = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

module.exports = Renderer
},{}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"./Input":2,"./Player":3,"./Renderer":4,"dup":1}],7:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],8:[function(require,module,exports){
// window makes this targetable outside the bundle
window.startGame = function() {
  var Game = require('./Game');
  console.log("Start the damn game");
  var game = new Game();
  game.newGame();
  game.run();
}

},{"./Game":1}],9:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],10:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}]},{},[5,6,7,8,9,10]);
