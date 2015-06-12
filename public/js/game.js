var canvas
  , stage
  , keys
  , localPlayer = {};

var init = function() {
  keys = new Keys();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);

  localPlayer = new Bike();
  localPlayer.init();

  setEventHandlers();
};

var setEventHandlers = function() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
  createjs.Ticker.addEventListener("tick", tick);
};

var tick = function() {
  if (localPlayer.getSprite()) localPlayer.update();

  stage.update();
};

var onKeydown = function(e) {
  if (localPlayer) {
    keys.onKeyDown(e);
  };
};


var onKeyup = function(e) {
  if (localPlayer) {
    keys.onKeyUp(e);
  };
};
