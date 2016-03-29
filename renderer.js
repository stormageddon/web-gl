'use strict'

console.log("loaded renderer.js");

var Renderer = Renderer || {}

var Renderer = function() {

}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var SPEED = .5;
var WIDTH = 160;
var HEIGHT = 120;
var SCALE = 4;


var xLoc = 10
var yLoc = 10
var w = 100
var h = 100
var rot = 0;
var rotDelta = 10;
var col = "red"
var colors = ["red", "blue", "green", "yellow", "black", "pink"]
var pixels = []

context.canvas.height = HEIGHT*SCALE;
context.canvas.width = WIDTH*SCALE;

context.fillStyle = col

Renderer.prototype.tick = function() {
  xLoc += SPEED;
  col = colors[Math.floor(Math.random() * colors.length)]
}

Renderer.prototype.draw = function() {
  clear();
  context.fillStyle = col
  context.fillRect(xLoc, yLoc, w, h);
}

Renderer.prototype.getContext = function() {
  return context;
}

var clear = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

module.exports = Renderer