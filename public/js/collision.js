'use strict';

var Collision = function() {
  function checkIntersection(col1, col2) {
    console.log('bike:', col1.y - col1.height);
    console.log('grass:', col2.y + col2.height);
  }

  return {
    checkIntersection: checkIntersection
  }
};