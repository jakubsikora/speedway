'use strict';

var canvas
  , stage
  , keys
  , track
  , localPlayer = {}
  , collision;

function tick() {
  //track.update();

  // TODO move somewhere - collision detection
  if (localPlayer.getSprite()) {

    // if (collision.checkIntersection(
    //     localPlayer.collision,
    //     track.collision)
    // ) {
    //   localPlayer.setFriction(0.5);
    // } else {
    //   localPlayer.setFriction(FRICTION_FACTOR);
    // }
  }

  $('#fps').text(Math.round(createjs.Ticker.getMeasuredFPS()));
  stage.update();
}

function update() {
  if (localPlayer.getSprite()) localPlayer.update();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
  setInterval(update, 100/3);
  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
}

function init() {
  keys = new Keys();
  //track = new Track();
  collision = new Collision();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  stage.mouseEventsEnabled = true;
  stage.mouseMoveOutside = false;

  // Maximise the canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  localPlayer = new Bike();
  localPlayer.init();
  //track.init();

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
