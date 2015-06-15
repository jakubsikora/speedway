'use strict';

var canvas
  , stage
  , keys
  , track
  , localPlayer = {};

function tick() {
  if (localPlayer.getSprite()) localPlayer.update();
  track.update();

  $('#fps').text(Math.round(createjs.Ticker.getMeasuredFPS()) + " / " + MAX_FPS);
  stage.update();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.framerate = MAX_FPS;
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
}

function init() {
  keys = new Keys();
  track = new Track();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  stage.mouseEventsEnabled = true;
  stage.mouseMoveOutside = false;

  // Maximise the canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  localPlayer = new Bike();
  localPlayer.init();
  track.init();

  setEventHandlers();
}

function onKeydown(e) {
  if (localPlayer) {
    keys.onKeyDown(e);
  }
}

function onKeyup(e) {
  if (localPlayer) {
    keys.onKeyUp(e);
  }
}
