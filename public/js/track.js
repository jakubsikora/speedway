'use strict';

var Track = function() {

  function init() {
    var stadium = new createjs.Shape();
    stadium.graphics
      .setStrokeStyle(1)
      .beginStroke("rgba(0,0,0,1)")
      .moveTo(20, 10)
      .lineTo(80, 10)
      .quadraticCurveTo(90, 10, 90, 20)
      .lineTo(90, 80)
      .quadraticCurveTo(90, 90, 80, 90)
      .lineTo(20, 90)
      .quadraticCurveTo(10, 90, 10, 80)
      .lineTo(10, 20)
      .quadraticCurveTo(10, 10, 20, 10);

    stage.addChild(stadium);
  }

  function update() {

  }

  return {
    init: init,
    update: update
  };
};
