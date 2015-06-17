var FRICTION_FACTOR = 0.023
  , TURN_ANGLE = 0.098172
  , MAX_CLUTCH = 3
  , MIN_CLUTCH = 1
  , SPEED = 0.15
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
  , FRAME_HEIGHT = 42;

$(document).ready(function() {
  $('.factor-input').change(function() {
    var factor = $(this).attr('data-factor');
    window[factor] = $(this).val();
  });
});