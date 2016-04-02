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