'use strict'

var Input = function() {

}

document.onkeypress = function(e) {

  var event;

  e = e || window.event
  var charCode = e.keyCode

  if (charCode === 112) {
    console.log("pause");
    event = new Event('pause');
  }

  if (charCode === 37 || charCode === 97) { // Left Arrow
    event = new CustomEvent('move', { 'detail': 'left' });
  }

  if (charCode === 38 || charCode === 119) { // Up Arrow
    event = new CustomEvent('move', { 'detail': 'up' });
  }

  if (charCode === 39 || charCode === 100) { // Right Arrow
    event = new CustomEvent('move', { 'detail': 'right' });
  }

  if (charCode === 40 || charCode === 115) { // Down Arrow
    event = new CustomEvent('move', { 'detail': 'down' });
  }

  document.dispatchEvent(event);

}
