'use strict'

var Input = function() {
}

document.onkeydown = function(e) {

  var event;

  e = e || window.event
  var charCode = e.keyCode || e.which

  if (charCode === 80) {
    event = new Event('pause');
  }

  if (charCode === 37) { // Left Arrow
    event = new CustomEvent('move', { 'detail': 'left' });
  }

  if (charCode === 38) { // Up Arrow
    event = new CustomEvent('move', { 'detail': 'up' });
  }

  if (charCode === 39) { // Right Arrow
    event = new CustomEvent('move', { 'detail': 'right' });
  }

  if (charCode === 40) { // Down Arrow
    event = new CustomEvent('move', { 'detail': 'down' });
  }

  if (event) {
    document.dispatchEvent(event);
  }

}
