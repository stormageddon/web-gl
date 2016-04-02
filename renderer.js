'use strict'

console.log("loaded renderer.js");

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

Renderer.prototype.tick = function() {
  if (!goal.exists()) {
    goal.generate(44, 44);
  }
  return goal;
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = goal.color();
  console.log(goal.location());
  var loc = goal.location();
  var size = goal.dimensions();
  console.log("Drawing Goal:", loc.x, loc.y, size.w, size.w);
  context.fillRect(loc.x * size.w, loc.y * size.h, size.w, size.h);
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