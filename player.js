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