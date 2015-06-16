'use strict';

var canvas
  , stage
  , keys
  , track
  , localPlayer = {};


function checkIntersection(rect1,rect2) {
  if (rect1.x >= rect2.x + rect2.width
      || rect1.x + rect1.width <= rect2.x
      || rect1.y >= rect2.y + rect2.height
      || rect1.y + rect1.height <= rect2.y) {
    return false;
  } else {

    return true;
  }
}

function tick() {
  if (localPlayer.getSprite()) localPlayer.update();
  track.update();

  // TODO move somewhere - collision detection
  if (localPlayer.getSprite()) {

    if (checkIntersection(
        localPlayer.getSprite().getBounds(),
        track.getStadiumCurb().getBounds())
    ) {
      localPlayer.setFriction(0.5);
    } else {
      localPlayer.setFriction(FRICTION_FACTOR);
    }
  }

  $('#fps').text(Math.round(createjs.Ticker.getMeasuredFPS()));
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

  initFactors();
  setEventHandlers();
}

function initFactors() {
  $('#bikeSPEEDFactor').val(SPEED);
  $('#bikeACCFactor').val(ACC);
  $('#bikeFRICTIONFactor').val(FRICTION_FACTOR);
  $('#bikeTURN_OFFSETFactor').val(TURN_OFFSET);
  $('#bikeMAX_CLUTCHFactor').val(MAX_CLUTCH);
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
