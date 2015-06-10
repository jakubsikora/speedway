var canvas
  , stage
  , img = new Image()
  , localPlayer = {};


var init = function() {
  setEventHandlers();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  img.onload = handleImageLoad;
  img.src = '/img/bloomfeld.png';
};

var setEventHandlers = function() {

}
