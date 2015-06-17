'use strict';

var Bike = function() {
  var forward = [0, 0]
    , velXY = [0, 0]
    , velocity = 0
    , thrust = false
    , clutch = false
    , clutchFactor = 1
    , friction = FRICTION_FACTOR
    , angle = 0
    , angleVel = 0
    , sprite = null
    , img = new Image()
    , mapping = new Mapping()
    , leftOffset = 0
    , rightOffset = 0
    , collision = {
        x: 0,
        y: 0,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT
      }
    , width = 42
    , height = 42;

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

    sprite.x = (CANVAS_WIDTH / 2) - 20;
    sprite.y = (CANVAS_HEIGHT / 2) + (GRASS_HEIGHT / 2) + 50;

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

  function preset() {
    clutch = keys.action ? true : false;

    // Thrust can happen only if clutch is not present.
    thrust = (!clutch && keys.up) ? true : false;

    // Turning
    if (keys.left) angleVel = -TURN_ANGLE;
    if (keys.right) angleVel = TURN_ANGLE;

    if (!keys.left && !keys.right) angleVel = 0;


    // Custom animation
    if (sprite && (!keys.left || !keys.right)) sprite.stop();
  }

  function update() {
    preset();

    velXY[0] *= (1 - friction);
    velXY[1] *= (1 - friction);

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

    if (sprite.x > CANVAS_WIDTH) {
      sprite.x = sprite.x % CANVAS_WIDTH;
    } else if (sprite.x < 0) {
      sprite.x = CANVAS_WIDTH + (sprite.x % CANVAS_WIDTH);
    }

    if (sprite.y > CANVAS_HEIGHT) {
      sprite.y = sprite.y % CANVAS_HEIGHT;
    } else if (sprite.y < 0) {
      sprite.y = CANVAS_HEIGHT + (sprite.y % CANVAS_HEIGHT);
    }

    if (keys.left) sprite.reverse();
    if (keys.right) sprite.forward();

    collision.x = sprite.x;
    collision.y = sprite.y;

    adjustFrameMapping();
    //log();
  }

  function getSprite() {
    return sprite;
  }

  function setFriction(newFriction) {
    friction = newFriction;
  }

  return {
    init: init,
    update: update,
    getSprite: getSprite,
    setFriction: setFriction,
    collision: collision
  };
};
