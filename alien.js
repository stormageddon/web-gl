'use strict'
// Uses the Module design pattern
var Sprite = function() {
  var Sprite = {};
  var url, pos, size, speed, frames, dir, once, dx, dy;

  Sprite.create = function(u, p, s, sp, f, startX, startY, d, o) {
    pos = p;
    size = s;
    speed = typeof sp === 'number' ? sp : 0;
    frames = f || 1;
    dir = d || 'horizontal';
    url = u;
    once = o;
    dx = startX || 0;
    dy = startY || 0
  }

  Sprite.render = function(context, resource) {
    // clear
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    var x = pos[0];
    var y = pos[1];

//    var dx = dx || 1;
//    var dy = dy || 1;

    context.drawImage(resource, x, y, 40, 50, dx, dy, 40, 50);
  }

  Sprite.update = function(newPos) {
    if (newPos == 'right') {
      dx = dx + speed;
    }

    if (newPos == 'left') {
      dx = dx - speed;
    }
  }

  return Sprite;

};

var AlienGame = (function(Sprite) {
  var AlienGame = {}
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var WIDTH = 160;
  var HEIGHT = 120;
  var SCALE = 4;

  var playerSprite;
  var sprite1 = new Image();

  console.log("AlienGame!");

  AlienGame.init = function() {
    context.canvas.width = WIDTH * SCALE;
    context.canvas.height = HEIGHT * SCALE;

    loadResources();
  }

  var loadResources = function() {
    sprite1 = new Image();
    sprite1.onload = function() {
      console.log("Loaded the sprite sheet!!");
      console.log("sprite:", Sprite);
      var newSprite = Sprite();
      newSprite.create('entity_sprites.png', [0,0], 32, 0, 0, 0, 0);
      newSprite.render(context, sprite1);

      var newSprite2 = Sprite();
      newSprite.create('entity_sprites.png', [48,0], 32, 1, 60, 60, 1, 60, 0);
      newSprite.render(context, sprite1);

      playerSprite = Sprite();
      playerSprite.create('entity_sprites.png', [96, 0], 32, 25, 120, WIDTH * SCALE / 2, HEIGHT * SCALE - 40);
      playerSprite.render(context, sprite1);
    }

    sprite1.src = 'entity_sprites.png';

  }

  document.addEventListener('move', function(e) {
    if (e.detail === 'left') {
      console.log('move left');
      playerSprite.update('left')
      playerSprite.render(context, sprite1)
    }

    if (e.detail === 'right') {
      console.log('move right');
      playerSprite.update('right')
      playerSprite.render(context, sprite1)
    }
  });

  AlienGame.init();

})(Sprite || {});


var Input = (function() {
  document.onkeydown = function(e) {
    var event;

    e = e || window.event;
    var charCode = e.keyCode || e.which;

    if (charCode === 37) {
      event = new CustomEvent('move', { 'detail': 'left' });
    }

    if (charCode === 39) {
      event = new CustomEvent('move', { 'detail': 'right' });
    }

    if (event) {
      document.dispatchEvent(event);
    }
  }

})();