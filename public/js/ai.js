var AI = function() {
  var forward = [0, 0]
    , velXY = [0, 0]
    , velocity = 0
    , thrust = false
    , clutch = false
    , clutchFactor = 1
    , friction = FRICTION_FACTOR * 10
    , angle = 0
    , angleVel = 0
    , sprite = null
    , img = new Image()
    , mapping = new Mapping()
    , mask = new Mask(FRAME_HEIGHT / 2)
    , waypoints
    , line = new createjs.Shape()
    , nextLine = new createjs.Shape();

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
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        regX: FRAME_WIDTH / 2,
        regY: FRAME_HEIGHT / 2
      }
    });

    sprite = new createjs.Sprite(spriteSheet);
    sprite.regX = sprite.spriteSheet.frameWidth / 2 | 0;
    sprite.regY = sprite.spriteSheet.frameHeight / 2 | 0;
    sprite.gotoAndStop(BIKE_START_FRAME);

    sprite.x = (CANVAS_WIDTH / 2) - 20;
    sprite.y = (CANVAS_HEIGHT / 2) + (GRASS_HEIGHT / 2) + 100;

    sprite.scaleX = 2;
    sprite.scaleY = 2;
    stage.addChild(sprite);

    mask.init(sprite.x, sprite.y);
    waypoints = waypoint.getWaypoints();
    stage.addChild(line);
    stage.addChild(nextLine);
  }

  function angleToVector(newAngle) {
    return [Math.cos(newAngle), Math.sin(newAngle)];
  }

  function update() {
    if (!sprite) return;
    //console.log(waypoint.getWaypoints());
    //sprite.x += 1;
    //sprite.x += 0.2;
    velXY[0] *= (1 - friction);
    velXY[1] *= (1 - friction);

    angle += angleVel;

    if (angle >= MAX_ANGLE || angle <= -MAX_ANGLE) {
      angle = 0;
    }

    forward = angleToVector(angle);

    velXY[0] += forward[0] * SPEED;
    velXY[1] += forward[1] * SPEED;

    sprite.x += velXY[0];
    sprite.y += velXY[1];

    mask.update(sprite.x, sprite.y);
    findPoint();
  }

  function findPoint() {
    var min = null
      , distance
      , dx
      , dy
      , waypoint
      , index
      , next;

    if (!waypoints) return;

    waypoints.forEach(function(item) {
      dx = sprite.x - item.x;
      dy = sprite.y - item.y;
      distance = Math.sqrt(dx * dx + dy * dy);

      if (!min) {
        min = distance;
        waypoint = item;
      } else if (distance < min) {
        min = distance;
        waypoint = item;
      }
    });

    index = waypoints.indexOf(waypoint);

    if (index > waypoints.length) {
      next = 0;
    } else {
      next = index + 1;
    }

    lookAtPoint(line, '#FF0000', waypoint);
    lookAtPoint(nextLine, '#FFFF00', waypoints[next]);
    moveToPoint(waypoints[next]);
  }

  function lookAtPoint(l, color, waypoint) {
    l.graphics
      .clear()
      .setStrokeStyle(1)
      .beginStroke(color)
      .moveTo(sprite.x + (FRAME_WIDTH / 2), sprite.y)
      .lineTo(waypoint.x, waypoint.y);
  }

  function moveToPoint(waypoint) {
    var dx = sprite.x - waypoint.x
      , dy = sprite.y - waypoint.y
      , distance = Math.sqrt(dx * dx + dy * dy)
      , maxDistance = 150
      , minDistance = 50;

    console.log(distance);

    if (distance > maxDistance) {
      console.log('turn left');
      angleVel = -TURN_ANGLE;
      sprite.reverse();
    } else if(distance < minDistance) {
      console.log('turn right');
      angleVel = TURN_ANGLE;
      sprite.forward();
    } else {
      angleVel = 0;
    }

  }

  return {
    init: init,
    update: update
  };
};
