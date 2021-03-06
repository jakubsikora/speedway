var FRICTION_FACTOR = 0.025
  , TURN_ANGLE = 0.098172
  , MAX_CLUTCH = 3
  , MIN_CLUTCH = 1
  , SPEED = 0.7
  , ACC = 1.2
  , BIKE_START_FRAME = 16
  , MAX_ANGLE = 6.28
  , CANVAS_WIDTH = 1300
  , CANVAS_HEIGHT = 800
  , MAX_FPS = 60
  , TURN_OFFSET = 1
  , GRASS_WIDTH = 520
  , GRASS_HEIGHT = 280
  , GRASS_OFFSET = 150
  , TRACK_OFFSET_X = 350
  , TRACK_OFFSET_Y = 250
  , FRAME_WIDTH = 42
  , FRAME_HEIGHT = 42
  , RIGHT_TURN_BOUNDS = {
      x1: (CANVAS_WIDTH / 2) + (GRASS_WIDTH / 2),
      y1: 0,
      x2: CANVAS_WIDTH,
      y2: CANVAS_HEIGHT
    }
  , LEFT_TURN_BOUNDS = {
      x1: 0,
      y1: 0,
      x2: (CANVAS_WIDTH / 2) - (GRASS_WIDTH / 2),
      y2: CANVAS_HEIGHT
    }
  , WAYPOINT_OFFSET = 10
  , WAYPOINT_DISTANCE = 60
  , AI_NUMBER = 1
  , AI_MAX_SPEED = 2;
