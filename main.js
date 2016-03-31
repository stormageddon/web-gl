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