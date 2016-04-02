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