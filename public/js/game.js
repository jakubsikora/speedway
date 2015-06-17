'use strict';

var canvas
  , stage
  , keys
  , track
  , localPlayer = {}
  , collision
  , mask;

function rectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}


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
    mask.x = localPlayer.getSprite().x;
    mask.y = localPlayer.getSprite().y;

    if (rectCircleColliding({
        x: mask.x,
        y: mask.y,
        r: localPlayer.circle.r
      }, {
        x: (CANVAS_WIDTH / 2) - (GRASS_WIDTH / 2),
        y: (CANVAS_HEIGHT / 2) - (GRASS_HEIGHT / 2),
        w: GRASS_WIDTH,
        h: GRASS_HEIGHT
      }
      )) {
        mask.graphics
          .clear()
          .setStrokeStyle(1)
          .beginStroke("#FF0000")
          .drawCircle(0, 0, localPlayer.circle.r);
    } else {
      mask.graphics
          .clear()
          .setStrokeStyle(1)
          .beginStroke("#000")
          .drawCircle(0, 0, localPlayer.circle.r);
    }
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
  track = new Track();
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
  track.init();

  mask = new createjs.Shape();
  mask.graphics
    .setStrokeStyle(1)
    .beginStroke("#000")
    .drawCircle(0, 0, localPlayer.circle.r);
  stage.addChild(mask);

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
