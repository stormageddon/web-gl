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
var player = new Player(200, 200, 'RIGHT', 'green', renderer);

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