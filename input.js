'use strict'

var Input = function() {

}

document.onkeydown = function(e) {

  var event;

  e = e || window.event
  var charCode = e.keyCode

  if (charCode === 112) {
    console.log("pause");
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

  document.dispatchEvent(event);

}
