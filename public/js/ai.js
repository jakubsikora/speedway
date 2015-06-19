var AI = function() {
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
    , mask = new Mask(FRAME_HEIGHT / 2)
    , waypoints;

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
  }

  function update() {
    //console.log(waypoint.getWaypoints());
    sprite.x += 0.2;
    mask.update(sprite.x, sprite.y);
    findPoint();
  }

  function findPoint() {
    if (!waypoints) return;

    var temp = waypoints[0];

    var dx = sprite.x - temp.x
      , dy = sprite.y - temp.y
      , distance = Math.sqrt(dx * dx + dy * dy);

    console.log(distance);

  }

  return {
    init: init,
    update: update
  };
};
