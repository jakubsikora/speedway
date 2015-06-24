var AI = function() {
  var forward = [0, 0]
    , velXY = [0, 0]
    , velocity = 0
    , distance = null
    , thrust = false
    , clutch = false
    , clutchFactor = 1
    , friction = FRICTION_FACTOR * 4
    , angle = 0
    , angleVel = 0
    , sprite = null
    , img = new Image()
    , mapping = new Mapping()
    , mask = new Mask(FRAME_HEIGHT / 2)
    , waypoints
    , line = new createjs.Shape()
    , nextLine = new createjs.Shape()
    , offset = 0;

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


    if (thrust) {
      velXY[0] += forward[0] * SPEED;
      velXY[1] += forward[1] * SPEED;
    }

    velocity = Math.sqrt((velXY[0] * velXY[0]) + (velXY[1] * velXY[1]));
    velocity = parseFloat(velocity).toFixed(2);

    if (velocity >= AI_MAX_SPEED) {
      thrust = false;
    } else {
      thrust = true;
    }

    sprite.x += velXY[0];
    sprite.y += velXY[1];

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

    mask.update(sprite.x, sprite.y);
    findPoint();
    updateHud();
  }

  function findPoint() {
    var min = null
      , dist
      , dx
      , dy
      , waypoint
      , index
      , next;

    if (!waypoints) return;

    waypoints.forEach(function(item) {
      dx = sprite.x - item.x;
      dy = sprite.y - item.y;
      dist = Math.sqrt(dx * dx + dy * dy);

      if (!min) {
        min = dist;
        waypoint = item;
      } else if (dist < min) {
        min = dist;
        waypoint = item;
      }
    });

    index = waypoints.indexOf(waypoint);

    if (index >= waypoints.length - 1) {
      next = 0;
    } else {
      next = index + 1;
    }

    //lookAtPoint(line, '#FF0000', waypoint);
    lookAtPoint(nextLine, '#FFFF00', waypoints[next]);
    moveToPoint(waypoints[next]);
  }

  function lookAtPoint(l, color, waypoint) {
    l.graphics
      .clear()
      .setStrokeStyle(1)
      .beginStroke(color)
      .moveTo(sprite.x, sprite.y)
      .lineTo(waypoint.x, waypoint.y);
  }

  function moveToPoint(waypoint) {
    var dx = sprite.x - waypoint.x
      , dy = sprite.y - waypoint.y
      , maxDistance = 130
      , minDistance = 50
      , maxOffset = 10;

    distance = Math.sqrt(dx * dx + dy * dy);

    if (waypoint.y + 5 < sprite.y) {
      handleTurningLeft();
    } else if (waypoint.y - 1 > sprite.y) {
      if (offset > maxOffset && angle < 0.2) {
        console.log('turning right');
        angleVel = TURN_ANGLE;
        sprite.forward();
        offset = 0;
      } else {
        console.log('right up');
        angleVel = 0;
      }

      offset++;
    } else {
      console.log('up');
      angleVel = 0;
      offset = 0;
    }
  }

  function checkTrackSection() {

  }

  function handleTurningLeft() {
    var maxOffset = 5;

    if (sprite.x > 350 && sprite.x < 950) {
      if (offset > maxOffset && angle > -0.2) {
        console.log('turning left');
        angleVel = -TURN_ANGLE;
        sprite.reverse();
        offset = 0;
      } else {
        console.log('left up');
        angleVel = 0;
      }

      offset++;
    } else if (sprite.x > 950) {
      if (offset > maxOffset && angle > -2.4) {
        console.log('turning left');
        angleVel = -TURN_ANGLE;
        sprite.reverse();
        offset = 0;
      } else {
        console.log('left up');
        angleVel = 0;
      }

      offset++;
    }
  }

  function updateHud() {
    var hud = document.querySelector('.bikeHud');

    hud.innerHTML = '' +
      '<ul>' +
      '<li>Vel: ' + velocity + '</li>' +
      '<li>Dist: ' + distance.toFixed(2) + '</li>' +
      '<li>X: ' + sprite.x.toFixed(0) + '</li>' +
      '<li>Y: ' + sprite.y.toFixed(0) + '</li>' +
      '<li>Angle: ' + angle + '</li>' +
      '<li>Angle Vel: ' + angleVel + '</li>' +
      '<li>Offset: ' + offset + '</li>' +
      '</ul>';
  }

  return {
    init: init,
    update: update
  };
};
