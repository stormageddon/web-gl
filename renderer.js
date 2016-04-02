'use strict'

var Renderer = Renderer || {}

var Renderer = function() {

}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var WIDTH = 450;
var HEIGHT = 450;
var SCALE = 1;

var Goal = require('./Goal');
var goal = new Goal();
var xLoc = 10;
var yLoc = 10;
var w = 100;
var h = 100;
var rot = 0;
var rotDelta = 10;
var col = "red";
var colors = ["red", "blue", "green", "yellow", "black", "pink"];
var pixels = [];

context.canvas.height = HEIGHT*SCALE;
context.canvas.width = WIDTH*SCALE;

context.fillStyle = col

var validGoalLoc = function(goal, snake) {
  for (var i = 0; i < snake.length; i++) {
    if (goal.x === snake[i].x && goal.y === snake[i].y) return false;
  }
  return true;
}

Renderer.prototype.tick = function(snake) {
  if (!goal.exists()) {
    var goalLoc = goal.generate(44, 44);
    while (!validGoalLoc(goalLoc, snake)) {
      goalLoc = goal.generate(44, 44);
    }
  }
  return goal;
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = goal.color();
  var loc = goal.location();
  var size = goal.dimensions();
  context.fillRect(loc.x * size.w, loc.y * size.h, size.w, size.h);
}

Renderer.prototype.drawPause = function() {
  context.fillStyle = "#ffffff";
  context.font = "20px Georgia";
  context.fillText("Press 'P' to unpause", WIDTH*SCALE / 4, HEIGHT*SCALE / 2);
  context.fillStyle = "#000000";
}

Renderer.prototype.getContext = function() {
  return context;
}

Renderer.prototype.clear = function() {
  clear();
}

var clear = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

module.exports = Renderer