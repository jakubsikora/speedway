'use strict';

var Collision = function() {
  function rectCircle(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.width / 2);
    var distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.height / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.width / 2)) {
        return true;
    }
    if (distY <= (rect.height / 2)) {
        return true;
    }

    var dx = distX - rect.width / 2;
    var dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
  }

  function circleCircle(circle1, circle2) {
    var dx = circle1.x - circle2.x
      , dy = circle1.y - circle2.y
      , distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.r + circle2.r) {
      return true;
    } else {
      return false;
    }
  }

  function circleCircleOuter(circle1, circle2, bounds) {
    var dx = circle2.x - circle1.x
      , dy = circle2.y - circle1.y
      , distance = Math.sqrt(dx * dx + dy * dy);

    if ((circle1.x > bounds.x1 && circle1.x < bounds.x2)
       && (circle1.y > bounds.y1 && circle1.y < bounds.y2)) {
      console.log('inside');
      if (distance > circle1.r + circle2.r) {
        return true;
      } else {
        return false;
      }
    }
  }

  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)^2+(y1-y2)^2);
  }

  return {
    rectCircle: rectCircle,
    circleCircle: circleCircle,
    circleCircleOuter: circleCircleOuter
  };
};