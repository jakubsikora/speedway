'use strict';

var Track = function() {
  var stadiumGrass = new createjs.Shape()
    , stadiumCurb = new createjs.Shape()
    , stadiumBand = new createjs.Shape()
    , stadiumBandEdge = new createjs.Shape()
    , x1 = (CANVAS_WIDTH / 2) - (GRASS_WIDTH / 2)
    , y1 = (CANVAS_HEIGHT / 2) - (GRASS_HEIGHT / 2)
    , x2 = (CANVAS_WIDTH / 2) + (GRASS_WIDTH / 2)
    , y2 = (CANVAS_HEIGHT / 2) + (GRASS_HEIGHT / 2)
    , bandx1 = x1
    , bandy1 = y1 - TRACK_OFFSET_Y
    , bandx2 = x2
    , bandy2 = y2 + TRACK_OFFSET_Y;

  function init() {
    stadiumGrass.graphics
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

    stadiumCurb.graphics
      .setStrokeStyle(4)
      .beginStroke("#FFF")
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
      );

    stadiumCurb.setBounds(x1, y1, GRASS_WIDTH, GRASS_HEIGHT);

    stadiumBand.graphics
      .setStrokeStyle(20)
      .beginStroke("#FED94C")
      .moveTo(bandx1, bandy1)
      .lineTo(bandx2, bandy1)
      .bezierCurveTo(
        bandx2 + GRASS_OFFSET + TRACK_OFFSET_X,
        bandy1,
        bandx2 + GRASS_OFFSET + TRACK_OFFSET_X,
        bandy2,
        bandx2,
        bandy2
      )
      .lineTo(bandx1, bandy2)
      .bezierCurveTo(
        bandx1 - GRASS_OFFSET - TRACK_OFFSET_X,
        bandy2,
        bandx1 - GRASS_OFFSET - TRACK_OFFSET_X,
        bandy1,
        bandx1,
        bandy1
      )
      .endFill();

    stadiumBandEdge.graphics
      .setStrokeStyle(24)
      .beginStroke("#000")
      .moveTo(bandx1, bandy1)
      .lineTo(bandx2, bandy1)
      .bezierCurveTo(
        bandx2 + GRASS_OFFSET + TRACK_OFFSET_X,
        bandy1,
        bandx2 + GRASS_OFFSET + TRACK_OFFSET_X,
        bandy2,
        bandx2,
        bandy2
      )
      .lineTo(bandx1, bandy2)
      .bezierCurveTo(
        bandx1 - GRASS_OFFSET - TRACK_OFFSET_X,
        bandy2,
        bandx1 - GRASS_OFFSET - TRACK_OFFSET_X,
        bandy1,
        bandx1,
        bandy1
      )
      .endFill();

    stage.addChild(stadiumCurb);
    stage.addChild(stadiumGrass);
    stage.addChild(stadiumBandEdge);
    stage.addChild(stadiumBand);
  }

  function update() {

  }

  function getInnerRectDimensions() {
    return [{
      x: x1,
      y: y1,
      width: GRASS_WIDTH,
      height: GRASS_HEIGHT
    }];
  }

  function getInnerCircleDimensions() {
    return [{
      x: x1,
      y: (CANVAS_HEIGHT / 2),
      r: GRASS_OFFSET - 35
    }, {
      x: x2,
      y: (CANVAS_HEIGHT / 2),
      r: GRASS_OFFSET - 35
    }];
  }

  function getOuterRectDimensions() {
    return [{
      x: bandx1,
      y: bandy1,
      width: bandx2 - bandx1,
      height: 6
    }, {
      x: bandx1,
      y: bandy2,
      width: bandx2 - bandx1,
      height: 6
    }];
  }

  function getOuterCircleDimensions() {
    return [{
      x: x1,
      y: (CANVAS_HEIGHT / 2),
      r: TRACK_OFFSET_X - 10,
      bounds: LEFT_TURN_BOUNDS
    },{
      x: x2,
      y: (CANVAS_HEIGHT / 2),
      r: TRACK_OFFSET_X - 10,
      bounds: RIGHT_TURN_BOUNDS
    }];
  }

  return {
    init: init,
    update: update,
    getInnerRectDimensions: getInnerRectDimensions,
    getInnerCircleDimensions: getInnerCircleDimensions,
    getOuterRectDimensions: getOuterRectDimensions,
    getOuterCircleDimensions: getOuterCircleDimensions
  };
};
