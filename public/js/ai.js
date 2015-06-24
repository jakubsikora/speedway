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

  function animate() {
    // TODO mappings
    var map = {
      '0.00': '16',
      '-0.10': '15',
      '-0.20': '14',
      '-0.29': '13',
      '-0.39': '12',
      '-0.49': '11',
      '-0.59': '10',
      '-0.69': '9',
      '-0.79': '8',
      '-0.88': '7',
      '-0.98': '6',
      '-1.08': '5',
      '-1.18': '4',
      '-1.28': '3',
      '-1.37': '2',
      '-1.47': '1',
      '-1.57': '0',
      '-1.67': '63',
      '-1.77': '62',
      '-1.87': '61',
      '-1.96': '60',
      '-2.06': '59',
      '-2.16': '58',
      '-2.26': '57',
      '-2.36': '56',
      '-2.45': '55',
      '-2.55': '54',
      '-2.65': '53',
      '-2.75': '52',
      '-2.85': '51',
      '-2.95': '50',
      '-3.04': '49',
      '-3.14': '48',
      '-3.24': '47',
      '-3.34': '46',
      '-3.44': '45',
      '-3.53': '44',
      '-3.63': '43',
      '-3.73': '42',
      '-3.83': '41',
      '-3.93': '40',
      '-4.03': '39',
      '-4.12': '38',
      '-4.22': '37',
      '-4.32': '36',
      '-4.42': '35',
      '-4.52': '34',
      '-4.61': '33',
      '-4.71': '32',
      '-4.81': '31',
      '-4.91': '30',
      '-5.01': '29',
      '-5.10': '28',
      '-5.20': '27',
      '-5.30': '26',
      '-5.40': '25',
      '-5.50': '24',
      '-5.60': '23',
      '-5.69': '22',
      '-5.79': '21',
      '-5.89': '20',
      '-5.99': '19',
      '-6.09': '18',
      '-6.18': '17'
    };
  }

  return {
    init: init,
    update: update
  };
};
