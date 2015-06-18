'use strict';

var canvas
  , stage
  , keys = new Keys()
  , track = new Track()
  , localPlayer = new Bike()
  , collision = new Collision();

function tick() {
  stage.update();
}

function update() {
  var trackInnerRectObjects = track.getInnerRectDimensions()
    , trackInnerCircleObjects = track.getInnerCircleDimensions()
    , trackOuterRectObjects = track.getOuterRectDimensions()
    , trackOuterCircleObjects = track.getOuterCircleDimensions()
    , localPlayerMask = localPlayer.getMask()
    , collisionStatus = false;

  if (trackInnerRectObjects && localPlayerMask) {
    trackInnerRectObjects.forEach(function(item) {
      if (collision.rectCircle(
        localPlayerMask,
        item)
      ) {
        collisionStatus = true;
      }
    });
  }

  if (trackInnerCircleObjects && localPlayerMask) {
    trackInnerCircleObjects.forEach(function(item) {
      if (collision.circleCircle(
        localPlayerMask,
        item)
      ) {
        collisionStatus = true;
      }
    });
  }

  if (trackOuterRectObjects && localPlayerMask) {
    trackOuterRectObjects.forEach(function(item) {
      if (collision.rectCircle(
        localPlayerMask,
        item)
      ) {
        collisionStatus = true;
      }
    });
  }

  if (trackOuterCircleObjects && localPlayerMask) {
    trackOuterCircleObjects.forEach(function(item) {
      if (collision.circleCircleOuter(
        localPlayerMask,
        item)
      ) {
        collisionStatus = true;
      }
    });
  }

  localPlayer.setCollision(collisionStatus);
  localPlayer.update();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);

  setInterval(update, 100/3);

  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
}

function init() {
  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  stage.mouseEventsEnabled = true;
  stage.mouseMoveOutside = false;

  // Maximise the canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

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
