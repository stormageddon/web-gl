// window makes this targetable outside the bundle
window.startGame = function() {
  var Game = require('./Game');
  console.log("Start the damn game");
  var game = new Game();
  game.newGame();
  game.run();
}
