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
  , clutch = false
  , clutchFactor = 1
  , MAX_CLUTCH = 3
  , MIN_CLUTCH = 1
  , angle = 0
  , angleVel = 0
  , speed = 0;


function checkFrameMapping() {
  var tolerance = 0.20
    , mappingRight = {
        17: 0.098172,
        18: 0.196344,
        19: 0.294516,
        20: 0.392688,
        21: 0.49085999999999996,
        22: 0.589032,
        23: 0.687204,
        24: 0.7853760000000001,
        25: 0.8835480000000001,
        26: 0.9817200000000001,
        27: 1.079892,
        28: 1.178064,
        29: 1.276236,
        30: 1.3744079999999999,
        31: 1.4725799999999998,
        32: 1.5707519999999997,
        33: 1.6689239999999996,
        34: 1.7670959999999996,
        35: 1.8652679999999995,
        36: 1.9634399999999994,
        37: 2.0616119999999993,
        38: 2.1597839999999993,
        39: 2.257955999999999,
        40: 2.356127999999999,
        41: 2.454299999999999,
        42: 2.552471999999999,
        43: 2.650643999999999,
        44: 2.748815999999999,
        45: 2.8469879999999987,
        46: 2.9451599999999987,
        47: 3.0433319999999986,
        48: 3.1415039999999985,
        49: 3.2396759999999984,
        50: 3.3378479999999984,
        51: 3.4360199999999983,
        52: 3.5341919999999982,
        53: 3.632363999999998,
        54: 3.730535999999998,
        55: 3.828707999999998,
        56: 3.926879999999998,
        57: 4.025051999999998,
        58: 4.123223999999998,
        59: 4.221395999999998,
        60: 4.319567999999998,
        61: 4.417739999999998,
        62: 4.5159119999999975,
        63: 4.614083999999997,
        0: 4.712255999999997,
        1: 4.810427999999997,
        2: 4.908599999999997,
        3: 5.006771999999997,
        4: 5.104943999999997,
        5: 5.203115999999997,
        6: 5.301287999999997,
        7: 5.399459999999997,
        8: 5.497631999999997,
        9: 5.595803999999997,
        10: 5.693975999999997,
        11: 5.7921479999999965,
        12: 5.8903199999999964,
        13: 5.988491999999996,
        14: 6.086663999999996,
        15: 6.184835999999996,
        16: 0
      }
    , mappingLeft = {
        15: -0.098172,
        14: -0.196344,
        13: -0.294516,
        12: -0.392688,
        11: -0.49085999999999996,
        10: -0.589032,
        9: -0.687204,
        8: -0.7853760000000001,
        7: -0.8835480000000001,
        6: -0.9817200000000001,
        5: -1.079892,
        4: -1.178064,
        3: -1.276236,
        2: -1.3744079999999999,
        1: -1.4725799999999998,
        0: -1.5707519999999997,
        63: -1.6689239999999996,
        62: -1.7670959999999996,
        61: -1.8652679999999995,
        60: -1.9634399999999994,
        59: -2.0616119999999993,
        58: -2.1597839999999993,
        57: -2.257955999999999,
        56: -2.356127999999999,
        55: -2.454299999999999,
        54: -2.552471999999999,
        53: -2.650643999999999,
        52: -2.748815999999999,
        51: -2.8469879999999987,
        50: -2.9451599999999987,
        49: -3.0433319999999986,
        48: -3.1415039999999985,
        47: -3.2396759999999984,
        46: -3.3378479999999984,
        45: -3.4360199999999983,
        44: -3.5341919999999982,
        43: -3.632363999999998,
        42: -3.730535999999998,
        41: -3.828707999999998,
        40: -3.926879999999998,
        39: -4.025051999999998,
        38: -4.123223999999998,
        37: -4.221395999999998,
        36: -4.319567999999998,
        35: -4.417739999999998,
        34: -4.5159119999999975,
        33: -4.614083999999997,
        32: -4.712255999999997,
        31: -4.810427999999997,
        30: -4.908599999999997,
        29: -5.006771999999997,
        28: -5.104943999999997,
        27: -5.203115999999997,
        26: -5.301287999999997,
        525: -5.399459999999997,
        24: -5.497631999999997,
        223: -5.595803999999997,
        22: -5.693975999999997,
        321: -5.7921479999999965,
        320: -5.8903199999999964,
        319: -5.988491999999996,
        18: -6.086663999999996,
        717: -6.184835999999996,
        16: 0
      };

  if (rightHeld) {
    if ((mappingRight[sprite.currentFrame] > angle)
        ||
        (mappingRight[sprite.currentFrame] < angle)) {
      angle = mappingRight[sprite.currentFrame];
    }
  }

  if (leftHeld) {
    if ((mappingLeft[sprite.currentFrame] > angle)
        ||
        (mappingLeft[sprite.currentFrame] < angle)) {
      angle = mappingLeft[sprite.currentFrame];
    }
  }
}

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

  if (angle >= 6.28 || angle <= -6.28) {
    angle = 0;
  }

  forward = angleToVector(angle);

  if (thrust) {
    if (angleVel === 0) {
      vel[0] += forward[0] * SPEED * ACC * clutchFactor;
      vel[1] += forward[1] * SPEED * ACC * clutchFactor;
    } else {
      vel[0] += forward[0] * SPEED;
      vel[1] += forward[1] * SPEED;
    }
  }

  if(upHeld && clutch) {
    if (clutchFactor < MAX_CLUTCH) {
      clutchFactor += 0.1;
    }
  } else {
    if (clutchFactor > MIN_CLUTCH) {
      clutchFactor -= 0.1;
    }
  }

  sprite.x += vel[0];
  sprite.y += vel[1];

  speed = Math.sqrt((vel[0] * vel[0]) + (vel[1] * vel[1]));
  speed = parseFloat(speed).toFixed(2);

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

  checkFrameMapping();
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

      if (!clutch) {
        thrust = true;
      }
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
    case 32:
      clutch = true;
      thrust = false;
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
    case 32:
      clutch = false;

      if (upHeld) {
        thrust = true;
      }
      break;
  }
}

function log() {
  var throttleBarWidth = 0
    , clutchBarWidth = 0;

  throttleBarWidth = speed * 180 / 24;

  if (throttleBarWidth > 180) throttleBarWidth = 180;

  clutchBarWidth = clutchFactor * 170 / MAX_CLUTCH;

  document.getElementById('bikePos').innerHTML =
    parseInt(sprite.x, 10) + ', ' + parseInt(sprite.y, 10);
  document.getElementById('bikeVel').innerHTML =
    parseFloat(vel[0]).toFixed(2) + ', ' + parseFloat(vel[1]).toFixed(2);
  document.getElementById('bikeForward').innerHTML =
    parseFloat(forward[0]).toFixed(2) + ', ' + parseFloat(forward[1]).toFixed(2);
  document.getElementById('bikeUp').innerHTML = (upHeld ? 'on' : 'off');
  document.getElementById('bikeThrust').innerHTML = (thrust ? 'on' : 'off');
  document.getElementById('bikeClutch').innerHTML = (clutch ? 'on' : 'off');
  document.getElementById('bikeAngle').innerHTML = parseFloat(angle).toFixed(2);
  document.getElementById('bikeAngleVel').innerHTML = angleVel;
  document.getElementById('bikeSpeed').innerHTML = speed;
  document.getElementById('bikeClutchFactor').innerHTML = parseFloat(clutchFactor).toFixed(2);
  document.getElementById('currentFrame').innerHTML = sprite.currentFrame;
  document.getElementById('bikeThrottleBar').style.width = throttleBarWidth + 'px';
  document.getElementById('bikeClutchBar').style.width = clutchBarWidth + 'px';
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