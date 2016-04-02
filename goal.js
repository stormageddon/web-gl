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

  var x = Math.floor(Math.random()*(xBoundary));
  var y = Math.floor(Math.random()*(yBoundary));

  xLoc = x;
  yLoc = y;
  exists = true;

  return {x: xLoc, y: yLoc};
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