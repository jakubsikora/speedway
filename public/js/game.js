var canvas
  , stage
  , line
  , img = new Image()
  , sprite
  , upHeld
  , downHeld
  , leftHeld
  , rightHeld
  , keyDown = false
  , currentFrame
  , FRICTION_FACTOR = 0.04
  , TURN_ANGLE = 0.098172
  , SPEED = 0.8
  , ACC = 1.2
  , forward = [0, 0]
  , vel = [0, 0]
  , thrust = false
  , angle = 0
  , angleVel = 0
  , speed = 0;


function angleToVector(newAngle) {
  return [Math.cos(newAngle), Math.sin(newAngle)];
}

function init() {
  setEventHandlers();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  img.onload = handleImageLoad;
  img.src = '/img/bloomfeld.png';
}

function handleImageLoad(e) {
  var spriteSheet = new createjs.SpriteSheet({
    // image to use
    images: [img],
    // width, height & registration point of each sprite
    frames: {
      width: 42,
      height: 42,
      regX: 21,
      regY: 21
    }
  });

  sprite = new createjs.Sprite(spriteSheet);
  sprite.regX = sprite.spriteSheet.frameWidth / 2 | 0;
  sprite.regY = sprite.spriteSheet.frameHeight / 2 | 0;
  sprite.gotoAndStop(16);

  currentFrame = sprite.currentFrame;

  sprite.x = 518;
  sprite.y = 648;

  sprite.scaleX = 2;
  sprite.scaleY = 2;

  stage.addChild(sprite);

  createjs.Ticker.addEventListener("tick", tick);
}

function tick() {
  vel[0] *= (1 - FRICTION_FACTOR);
  vel[1] *= (1 - FRICTION_FACTOR);

  angle += angleVel;
  forward = angleToVector(angle);

  if (thrust) {
    if (angleVel === 0) {
      vel[0] += forward[0] * SPEED * ACC;
      vel[1] += forward[1] * SPEED * ACC;
    } else {
      vel[0] += forward[0] * SPEED;
      vel[1] += forward[1] * SPEED;
    }
  }

  sprite.x += vel[0];
  sprite.y += vel[1];

  speed = Math.sqrt((vel[0] * vel[0]) + (vel[1] * vel[1]));
  speed = parseFloat(speed).toFixed(2)

  if (sprite.x > canvas.width) {
    sprite.x = sprite.x % canvas.width;
  } else if (sprite.x < 0) {
    sprite.x = canvas.width + (sprite.x % canvas.width);
  }

  if (sprite.y > canvas.height) {
    sprite.y = sprite.y % canvas.height;
  } else if (sprite.y < 0) {
    sprite.y = canvas.height + (sprite.y % canvas.height);
  }

  if (leftHeld) {
    sprite.reverse();
    keyDown = true;
  }

  if (rightHeld) {
    sprite.forward();
    keyDown = true;
  }

  stage.update();
  log();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
}

function onKeydown(e) {
  switch(e.keyCode) {
    case 38:
      upHeld = true;
      thrust = true;
      break;
    case 40:
      downHeld = true;
      thrust = false;
      break;
    case 37:
      leftHeld = true;
      angleVel = -TURN_ANGLE;
      break;
    case 39:
      rightHeld = true;
      angleVel = TURN_ANGLE;
      break;
  }
}

function onKeyup(e) {
  switch(e.keyCode) {
    case 38:
      upHeld = false;
      keyDown = false;
      thrust = false;
      break;
    case 40:
      downHeld = false;
      keyDown = false;
      thrust = false;
      break;
    case 37:
      angleVel = 0;
      leftHeld = false;
      keyDown = false;
      currentFrame = sprite.currentFrame;
      sprite.stop();
      break;
    case 39:
      angleVel = 0;
      rightHeld = false;
      keyDown = false;
      currentFrame = sprite.currentFrame;
      sprite.stop();
      break;
  }
}

function log() {
  var barWidth = 0
    , maxWidth = 180;

  barWidth = speed * maxWidth / 24;

  document.getElementById('bikePos').innerHTML =
    parseInt(sprite.x, 10) + ', ' + parseInt(sprite.y, 10);
  document.getElementById('bikeVel').innerHTML =
    parseFloat(vel[0]).toFixed(2) + ', ' + parseFloat(vel[1]).toFixed(2);
  document.getElementById('bikeForward').innerHTML =
    parseFloat(forward[0]).toFixed(2) + ', ' + parseFloat(forward[1]).toFixed(2);
  document.getElementById('bikeThrust').innerHTML = (thrust ? 'on' : 'off');
  document.getElementById('bikeAngle').innerHTML = parseFloat(angle).toFixed(2);
  document.getElementById('bikeAngleVel').innerHTML = angleVel;
  document.getElementById('bikeSpeed').innerHTML = speed;
  document.getElementById('currentFrame').innerHTML = sprite.currentFrame;
  document.getElementById('bikeThrottleBar').style.width = barWidth + 'px';
};

createjs.Sprite.prototype.reverse = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame <= 0) {
        currentFrame = numFrames - 1;
    } else {
        currentFrame--;
    }
    this.gotoAndStop(currentFrame);
};

createjs.Sprite.prototype.forward = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame >= numFrames) {
        currentFrame = 0;
    } else {
        currentFrame++;
    }
    this.gotoAndStop(currentFrame);
};