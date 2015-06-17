'use strict';

var Mask = function(newRadius) {
  var instance
    , radius = newRadius
    , collide = false;

  function init(x, y) {
    instance = new createjs.Shape();

    instance.graphics
      .setStrokeStyle(1)
      .beginStroke("#000")
      .drawCircle(0, 0, radius);
    instance.x = x;
    instance.y = y;

    stage.addChild(instance);
  }

  function update(x, y) {
    instance.y = y;
    instance.x = x;

    if (collide) {
      instance.graphics
        .clear()
        .setStrokeStyle(1)
        .beginStroke("#FF0000")
        .drawCircle(0, 0, radius);
    } else {
      instance.graphics
        .clear()
        .setStrokeStyle(1)
        .beginStroke("#000")
        .drawCircle(0, 0, radius);
    }
  }

  function setCollide(state) {
    collide = state;
  }

  function getDimensions() {
    return instance ? {
      x: instance.x,
      y: instance.y,
      r: radius
    } : null;
  }

  return {
    init: init,
    update: update,
    getDimensions: getDimensions,
    setCollide: setCollide,
    collide: collide
  }
};

// function rectCircleColliding(circle, rect) {
//     var distX = Math.abs(circle.x - rect.x - rect.w / 2);
//     var distY = Math.abs(circle.y - rect.y - rect.h / 2);

//     if (distX > (rect.w / 2 + circle.r)) {
//         return false;
//     }
//     if (distY > (rect.h / 2 + circle.r)) {
//         return false;
//     }

//     if (distX <= (rect.w / 2)) {
//         return true;
//     }
//     if (distY <= (rect.h / 2)) {
//         return true;
//     }

//     var dx = distX - rect.w / 2;
//     var dy = distY - rect.h / 2;
//     return (dx * dx + dy * dy <= (circle.r * circle.r));
// }

// mask.x = localPlayer.getSprite().x;
//     mask.y = localPlayer.getSprite().y;

//     if (rectCircleColliding({
//         x: mask.x,
//         y: mask.y,
//         r: localPlayer.circle.r
//       }, {
//         x: (CANVAS_WIDTH / 2) - (GRASS_WIDTH / 2),
//         y: (CANVAS_HEIGHT / 2) - (GRASS_HEIGHT / 2),
//         w: GRASS_WIDTH,
//         h: GRASS_HEIGHT
//       }
//       )) {
//         mask.graphics
//           .clear()
//           .setStrokeStyle(1)
//           .beginStroke("#FF0000")
//           .drawCircle(0, 0, localPlayer.circle.r);
//     } else {
//       mask.graphics
//           .clear()
//           .setStrokeStyle(1)
//           .beginStroke("#000")
//           .drawCircle(0, 0, localPlayer.circle.r);
//     }