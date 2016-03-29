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