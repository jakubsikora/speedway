function Bike() {
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
    , currentFrame =0;


  var init = function() {
    console.log('bike');
    img.onload = handleImageLoad;
    img.src = '/img/bloomfeld.png';
  }

  var handleImageLoad = function() {
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

  var update = function() {
    console.log('update');
    preset();

    vel[0] *= (1 - FRICTION_FACTOR);
    vel[1] *= (1 - FRICTION_FACTOR);

    angle += angleVel;

    if (angle >= MAX_ANGLE || angle <= -MAX_ANGLE) {
      angle = 0;
    }
  };

  var preset = function() {
    console.log('preset');
    clutch = keys.action ? true : false;

    // Thrust can happen only if clutch is not present.
    thrust = (!clutch && keys.up) ? true : false;

    // Turning
    angleVel = keys.left ? -TURN_ANGLE : 0;
    angleVel = keys.right ? TURN_ANGLE : 0;

    // Custom animation
    if (!keys.left || !keys.right) sprite.stop();
  }

  return {
    init: init,
    update: update
  }
}