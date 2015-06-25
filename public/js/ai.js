var AI = function() {
  var forward = [0, 0]
    , velXY = [0, 0]
    , velocity = 0
    , distance = 0
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
    , aLine = new createjs.Shape()
    , bLine = new createjs.Shape()
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
    stage.addChild(aLine);
    stage.addChild(bLine);
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

    // if (velocity >= AI_MAX_SPEED) {
    //   thrust = false;
    // } else {
    //   thrust = true;
    // }

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
    //findPoint();
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
    //lookAtPoint(nextLine, '#FFFF00', waypoints[next]);
    //moveToPoint(waypoints[next]);
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
      //handleTurningLeft();
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

  function drawVect(l, color, x1, y1, x2, y2) {
    l.graphics
      .clear()
      .setStrokeStyle(1)
      .beginStroke(color)
      .moveTo(x1, y1)
      .lineTo(x2, y2);
  }

  function updateHud() {
    var hud = document.querySelector('.aiHud')
      , html = ''
      , vectA = []
      , vectB = []
      , normVectA = []
      , normVectB = []
      , adx
      , ady
      , bdx
      , bdy
      , point
      , distB
      , distA
      , normB
      , normA
      , cos
      , alpha
      , radians
      , up = false
      , down = false
      , left = false
      , right = false
      , angleFactor = 1;

    waypoints = waypoint.getWaypoints();

    html = '' +
      '<ul>' +
      '<li>Vel: ' + velocity + '</li>' +
      '<li>Dist: ' + distance.toFixed(2) + '</li>' +
      '<li>Frame: ' + sprite.currentFrame + '</li>' +
      '<li>Pos: ' + sprite.x.toFixed(0) + ', ' + sprite.y.toFixed(0) + '</li>' +
      '<li>Angle: ' + angle.toFixed(2) + '</li>' +
      '<li>Angle Vel: ' + angleVel.toFixed(2) + '</li>' +
      '<li>Offset: ' + offset + '</li>' +
      '<li>Forward: (' + forward[0].toFixed(2) + ', ' + forward[1].toFixed(2) + ')</li>';

    if (waypoints.length) {
      point = waypoints[0];

      var normPoints = normalizePoints(sprite, point);

      bdx = normPoints.a.x - normPoints.b.x;
      bdy = normPoints.a.y - normPoints.b.y;
      adx = normPoints.a.x - normPoints.b.x;
      ady = normPoints.a.y - normPoints.a.y;

      vectA = [adx, ady];
      vectB = [bdx, bdy];

      distB = Math.sqrt(bdx * bdx + bdy * bdy);
      distA = Math.sqrt(adx * adx + ady * ady);

      distance = distB;

      if (distance <= 70) {
        thrust = false;
      } else {
        thrust = true;
      }

      if (normPoints.b.x > 0) {
        up = true;
        down = false;

        if (normPoints.b.y > 0) {
          left = false;
          right = true;
          angleFactor = 1;
        }

        if (normPoints.b.y <= 0) {
          left = true;
          right = false;
          angleFactor = -1;
        }
      }

      if (normPoints.b.x <= 0) {
        up = false;
        down = true;

        if (normPoints.b.y > 0) {
          left = true;
          right = false;
          angleFactor = 1;
        }

        if (normPoints.b.y <= 0) {
          left = false;
          right = true;
          angleFactor = -1;
        }
      }

      normVectA = normalize(distA, vectA[0], vectA[1]);
      normVectB = normalize(distB, vectB[0], vectB[1]);

      distA = Math.sqrt(normVectA[0] * normVectA[0] + normVectA[1] * normVectA[1]);
      distB = Math.sqrt(normVectB[0] * normVectB[0] + normVectB[1] * normVectB[1]);

      cos = (normVectA[0] * normVectB[0] + normVectA[1] * normVectB[1]) / (distA * distB);
      alpha = Math.acos(cos) * 180 / Math.PI;

      alpha = down ? 180 - alpha : alpha;
      radians = alpha * Math.PI / 180;

      angle = radians * angleFactor;

      if (thrust) animate(up, left);

      drawVect(aLine, '#00FF00', sprite.x, sprite.y, point.x, sprite.y);
      drawVect(bLine, '#FF0000', sprite.x, sprite.y, point.x, point.y);

      html += '' +
        '<li>WAYPOINT</li>' +
        '<li>Waypoint: (' + point.x + ', ' + point.y + ')</li>' +
        '<li>vect A: [' + vectA[0].toFixed() + ',' + vectA[1].toFixed() + ']</li>' +
        '<li>vect B: [' + vectB[0].toFixed() + ',' + vectB[1].toFixed() + ']</li>' +
        '<li>norm vect A: [' + normVectA[0].toFixed(2) + ',' + normVectA[1].toFixed(2) + ']</li>' +
        '<li>norm vect B: [' + normVectB[0].toFixed(2) + ',' + normVectB[1].toFixed(2) + ']</li>' +

        '<li>vect |A|: ' + distA.toFixed(2) + '</li>' +
        '<li>vect |B|: ' + distB.toFixed(2) + '</li>' +
        '<li>cos &alpha;: ' + cos.toFixed(4) + '</li>' +
        '<li>&alpha;: ' + alpha.toFixed(0) + '</li>' +
        '<li>Rad: ' + radians.toFixed(4) + '</li>' +
        '<li>Up: ' + up + '</li>' +
        '<li>Down: ' + down + '</li>' +
        '<li>Left: ' + left + '</li>' +
        '<li>Right: ' + right + '</li>';
    }

    html += '</ul>';


    hud.innerHTML = html;
  }

  function normalize(distance, x, y) {
    return [x / distance, y / distance];
  }

  function normalizePoints(point1, point2) {
    var a = { x: 0, y: 0}
      , b = { x: 0, y: 0};

    b.x = point2.x - point1.x;
    b.y = point2.y - point1.y;

    return {
      a: a,
      b: b
    };
  }

  function animate(up, left) {
    // TODO mappings
    var mapLeft = [
      { frame: 16, angle: 0.00 },
      { frame: 15, angle: -0.10 },
      { frame: 14, angle: -0.20 },
      { frame: 13, angle: -0.29 },
      { frame: 12, angle: -0.39 },
      { frame: 11, angle: -0.49 },
      { frame: 10, angle: -0.59 },
      { frame: 9, angle: -0.69 },
      { frame: 8, angle: -0.79 },
      { frame: 7, angle: -0.88 },
      { frame: 6, angle: -0.98 },
      { frame: 5, angle: -1.08 },
      { frame: 4, angle: -1.18 },
      { frame: 3, angle: -1.28 },
      { frame: 2, angle: -1.37 },
      { frame: 1, angle: -1.47 },
      { frame: 0, angle: -1.57 },
      { frame: 63, angle: -1.67 },
      { frame: 62, angle: -1.77 },
      { frame: 61, angle: -1.87 },
      { frame: 60, angle: -1.96 },
      { frame: 59, angle: -2.06 },
      { frame: 58, angle: -2.16 },
      { frame: 57, angle: -2.26 },
      { frame: 56, angle: -2.36 },
      { frame: 55, angle: -2.45 },
      { frame: 54, angle: -2.55 },
      { frame: 53, angle: -2.65 },
      { frame: 52, angle: -2.75 },
      { frame: 51, angle: -2.85 },
      { frame: 50, angle: -2.95 },
      { frame: 49, angle: -3.04 },
      { frame: 48, angle: -3.14 },
      { frame: 47, angle: -3.24 },
      { frame: 46, angle: -3.34 },
      { frame: 45, angle: -3.44 },
      { frame: 44, angle: -3.53 },
      { frame: 43, angle: -3.63 },
      { frame: 42, angle: -3.73 },
      { frame: 41, angle: -3.83 },
      { frame: 40, angle: -3.93 },
      { frame: 39, angle: -4.03 },
      { frame: 38, angle: -4.12 },
      { frame: 37, angle: -4.22 },
      { frame: 36, angle: -4.32 },
      { frame: 35, angle: -4.42 },
      { frame: 34, angle: -4.52 },
      { frame: 33, angle: -4.61 },
      { frame: 32, angle: -4.71 },
      { frame: 31, angle: -4.81 },
      { frame: 30, angle: -4.91 },
      { frame: 29, angle: -5.01 },
      { frame: 28, angle: -5.10 },
      { frame: 27, angle: -5.20 },
      { frame: 26, angle: -5.30 },
      { frame: 25, angle: -5.40 },
      { frame: 24, angle: -5.50 },
      { frame: 23, angle: -5.60 },
      { frame: 22, angle: -5.69 },
      { frame: 21, angle: -5.79 },
      { frame: 20, angle: -5.89 },
      { frame: 19, angle: -5.99 },
      { frame: 18, angle: -6.09 },
      { frame: 17, angle: -6.18 }
    ]
    , mapRight = [
      { frame: 16, angle: 0.00 },
      { frame: 17, angle: 0.10 },
      { frame: 18, angle: 0.20 },
      { frame: 19, angle: 0.29 },
      { frame: 20, angle: 0.39 },
      { frame: 21, angle: 0.49 },
      { frame: 22, angle: 0.59 },
      { frame: 23, angle: 0.69 },
      { frame: 24, angle: 0.79 },
      { frame: 25, angle: 0.88 },
      { frame: 26, angle: 0.98 },
      { frame: 27, angle: 1.08 },
      { frame: 28, angle: 1.18 },
      { frame: 29, angle: 1.28 },
      { frame: 30, angle: 1.37 },
      { frame: 31, angle: 1.47 },
      { frame: 32, angle: 1.57 },
      { frame: 33, angle: 1.67 },
      { frame: 34, angle: 1.77 },
      { frame: 35, angle: 1.87 },
      { frame: 36, angle: 1.96 },
      { frame: 37, angle: 2.06 },
      { frame: 38, angle: 2.16 },
      { frame: 39, angle: 2.26 },
      { frame: 40, angle: 2.36 },
      { frame: 41, angle: 2.45 },
      { frame: 42, angle: 2.55 },
      { frame: 43, angle: 2.65 },
      { frame: 44, angle: 2.75 },
      { frame: 45, angle: 2.85 },
      { frame: 46, angle: 2.95 },
      { frame: 47, angle: 3.04 },
      { frame: 48, angle: 3.14 },
      { frame: 49, angle: 3.24 },
      { frame: 50, angle: 3.34 },
      { frame: 51, angle: 3.44 },
      { frame: 52, angle: 3.53 },
      { frame: 53, angle: 3.63 },
      { frame: 54, angle: 3.73 },
      { frame: 55, angle: 3.83 },
      { frame: 56, angle: 3.93 },
      { frame: 57, angle: 4.03 },
      { frame: 58, angle: 4.12 },
      { frame: 59, angle: 4.22 },
      { frame: 60, angle: 4.32 },
      { frame: 61, angle: 4.42 },
      { frame: 62, angle: 4.52 },
      { frame: 63, angle: 4.61 },
      { frame: 0, angle: 4.71 },
      { frame: 1, angle: 4.81 },
      { frame: 2, angle: 4.91 },
      { frame: 3, angle: 5.01 },
      { frame: 4, angle: 5.10 },
      { frame: 5, angle: 5.20 },
      { frame: 6, angle: 5.30 },
      { frame: 7, angle: 5.40 },
      { frame: 8, angle: 5.50 },
      { frame: 9, angle: 5.60 },
      { frame: 10, angle: 5.69 },
      { frame: 11, angle: 5.79 },
      { frame: 12, angle: 5.89 },
      { frame: 13, angle: 5.99 },
      { frame: 14, angle: 6.09 },
      { frame: 15, angle: 6.18 }
    ];

    function getIndex(map, frame) {
      var mapEl = map.filter(function(item) {
        return item.frame === frame;
      })[0];

      return map.indexOf(mapEl);
    }

    var index = 0
      , currentAngle;

    if (angle < 0) {

      found = false;
      while (!found) {
        index = getIndex(mapLeft, sprite.currentFrame);
        var current = mapLeft[index];
        console.log('frame angle:', current.angle, 'heading to:', angle.toFixed(2), 'frame: ', sprite.currentFrame);

        // console.log(current.angle, '>' , angle.toFixed(2), '<=', current.angle);
        // debugger;
        // if (current.angle > angle && angle <= current.angle) {
        //   found = true;
        // } else {
        //   sprite.reverse();
        // }
      }
    }



  }

  return {
    init: init,
    update: update
  };
};
