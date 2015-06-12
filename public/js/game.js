'use strict';

var canvas
  , stage
  , keys
  , track
  , localPlayer = {};

function tick() {
  if (localPlayer.getSprite()) localPlayer.update();
  track.update();

  stage.update();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
  createjs.Ticker.addEventListener("tick", tick);
}

function init() {
  keys = new Keys();
  track = new Track();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);

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
