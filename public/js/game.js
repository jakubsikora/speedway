'use strict';

var canvas
  , stage
  , keys = new Keys()
  , track = new Track()
  , localPlayer = new Bike()
  , collision = new Collision()
  , waypoint = new Waypoint()
  , ai = [];

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

  if (ai.length) {
    ai.forEach(function(item) {
      item.update();
    });
  }
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
  canvas.addEventListener("mousedown", onMouseDown, false);

  setInterval(update, 100/3);

  createjs.Ticker.addEventListener("tick", tick);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
}

function init() {
  var tempAI;

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  stage.mouseEventsEnabled = true;
  stage.mouseMoveOutside = false;

  // Maximise the canvas
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  localPlayer.init();
  track.init();
  waypoint.init();

  for(var i = 0; i < AI_NUMBER; i++) {
    tempAI = new AI();
    tempAI.init();
    ai.push(tempAI);
  }

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

function onMouseDown(e) {
  var x = e.x
    , y = e.y;

  waypoint.draw(x,y);
}
