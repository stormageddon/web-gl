'use strict'

var Goal = Goal || {}

var xLoc;
var yLoc;
var w;
var h;
var fillColor = 'red';
var exists = false;

var Goal = function() {
  w = 10;
  h = 10;
}

Goal.prototype.exists = function() {
  return exists;
}

Goal.prototype.generate = function(xBoundary, yBoundary) {
  var xB = xBoundary - w;
  if (xB <= 0) xB = 0;
  var yB = yBoundary - h;
  if (yB >= (120*4)) yB = 120*4 - h;
  xLoc = Math.floor(Math.random() * xBoundary);
  yLoc = Math.floor(Math.random() * yBoundary);
  exists = true;
}

Goal.prototype.location = function() {
  return {x: xLoc, y: yLoc}
}

Goal.prototype.dimensions = function() {
  return {w: w, h: h}
}

Goal.prototype.color = function() {
  return fillColor;
}

Goal.prototype.regenerate = function() {
  exists = false;
}

module.exports = Goal