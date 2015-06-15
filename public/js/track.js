'use strict';

var Track = function() {

  function init() {
    var x0 = CANVAS_WIDTH / 2
      , y0 = CANVAS_HEIGHT / 2
      , x1 = (CANVAS_WIDTH / 2) - (GRASS_WIDTH / 2)
      , y1 = (CANVAS_HEIGHT / 2) - (GRASS_HEIGHT / 2)
      , x2 = (CANVAS_WIDTH / 2) + (GRASS_WIDTH / 2)
      , y2 = (CANVAS_HEIGHT / 2) + (GRASS_HEIGHT / 2);

    var stadium = new createjs.Shape();
    stadium.graphics
      .setStrokeStyle(1)
      .beginStroke("#555555")
      .beginFill("#78AB46")
      .moveTo(x1, y1)
      .lineTo(x2, y1)
      .bezierCurveTo(
        x2 + GRASS_OFFSET,
        y1,
        x2 + GRASS_OFFSET,
        y2,
        x2,
        y2
      )
      .lineTo(x1, y2)
      .bezierCurveTo(
        x1 - GRASS_OFFSET,
        y2,
        x1 - GRASS_OFFSET,
        y1,
        x1,
        y1
      )
      .endFill();

    stage.addChild(stadium);
  }

  function update() {

  }

  return {
    init: init,
    update: update
  };
};
