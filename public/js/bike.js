'use strict';

var Bike = function() {
  var forward = [0, 0]
    , velXY = [0, 0]
    , velocity = 0
    , thrust = false
    , clutch = false
    , clutchFactor = 1
    , angle = 0
    , angleVel = 0
    , sprite = null
    , img = new Image()
    , mapping = new Mapping();

  function init() {
    img.onload = handleImageLoad;
    img.src = '/img/bloomfeld.png';
  }

  function handleImageLoad() {
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
    sprite.gotoAndStop(BIKE_START_FRAME);

    sprite.x = 518;
    sprite.y = 648;

    sprite.scaleX = 2;
    sprite.scaleY = 2;

    stage.addChild(sprite);
  }

  function angleToVector(newAngle) {
    return [Math.cos(newAngle), Math.sin(newAngle)];
  }

  function adjustFrameMapping() {
    if (keys.right) {
      if ((mapping.right[sprite.currentFrame] > angle)
          ||
          (mapping.right[sprite.currentFrame] < angle)) {
        angle = mapping.right[sprite.currentFrame];
      }
    }

    if (keys.left) {
      if ((mapping.left[sprite.currentFrame] > angle)
          ||
          (mapping.left[sprite.currentFrame] < angle)) {
        angle = mapping.left[sprite.currentFrame];
      }
    }
  }

  function preset() {
    clutch = keys.action ? true : false;

    // Thrust can happen only if clutch is not present.
    thrust = (!clutch && keys.up) ? true : false;

    // Turning
    angleVel = keys.left ? -TURN_ANGLE : 0;
    angleVel = keys.right ? TURN_ANGLE : 0;

    // Custom animation
    if (sprite && (!keys.left || !keys.right)) sprite.stop();
  }

  function log() {
    var throttleBarWidth = 0
      , clutchBarWidth = 0;

    throttleBarWidth = velocity * 180 / 24;

    if (throttleBarWidth > 180) throttleBarWidth = 180;

    clutchBarWidth = clutchFactor * 170 / MAX_CLUTCH;

    $('#bikePos').text(parseInt(sprite.x, 10) + ', ' + parseInt(sprite.y, 10));
    $('#bikeVel').text(parseFloat(velXY[0]).toFixed(2) + ', ' + parseFloat(velXY[1]).toFixed(2));
    $('#bikeForward').text(parseFloat(forward[0]).toFixed(2) + ', ' + parseFloat(forward[1]).toFixed(2));
    $('#bikeUp').text((keys.up ? 'on' : 'off'));
    $('#bikeThrust').text((thrust ? 'on' : 'off'));
    $('#bikeClutch').text((clutch ? 'on' : 'off'));
    $('#bikeAngle').text(parseFloat(angle).toFixed(2));
    $('#bikeAngleVel').text(angleVel);
    $('#bikeSpeed').text(velocity);
    $('#bikeClutchFactor').text(parseFloat(clutchFactor).toFixed(2));
    $('#currentFrame').text(sprite.currentFrame);
    $('#bikeThrottleBar').css('width', throttleBarWidth + 'px');
    $('#bikeClutchBar').css('width', clutchBarWidth + 'px');
  }

  function update() {
    preset();

    velXY[0] *= (1 - FRICTION_FACTOR);
    velXY[1] *= (1 - FRICTION_FACTOR);

    angle += angleVel;

    if (angle >= MAX_ANGLE || angle <= -MAX_ANGLE) {
      angle = 0;
    }

    forward = angleToVector(angle);

    if (thrust) {
      if (angleVel === 0) {
        velXY[0] += forward[0] * SPEED * ACC * clutchFactor;
        velXY[1] += forward[1] * SPEED * ACC * clutchFactor;
      } else {
        velXY[0] += forward[0] * SPEED;
        velXY[1] += forward[1] * SPEED;
      }
    }

    if(keys.up && clutch) {
      if (clutchFactor < MAX_CLUTCH) {
        clutchFactor += 0.1;
      }
    } else {
      if (clutchFactor > MIN_CLUTCH) {
        clutchFactor -= 0.1;
      }
    }

    sprite.x += velXY[0];
    sprite.y += velXY[1];

    velocity = Math.sqrt((velXY[0] * velXY[0]) + (velXY[1] * velXY[1]));
    velocity = parseFloat(velocity).toFixed(2);

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

    if (keys.left) {
      sprite.reverse();
    }

    if (keys.right) {
      sprite.forward();
    }

    adjustFrameMapping();
    log();
  }

  function getSprite() {
    return sprite;
  }

  return {
    init: init,
    update: update,
    getSprite: getSprite
  };
};
