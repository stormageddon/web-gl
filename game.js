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
  player = new Player(200, 200, 'RIGHT', '#1ec503', renderer);
  renderer.drawPoints(0);
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
  }
}

var render = function() {
  renderer.draw();
  player.draw();
  renderer.drawPoints(player.getPoints());
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