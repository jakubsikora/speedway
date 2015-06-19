var Waypoint = function() {
  var x = (CANVAS_WIDTH / 2)
    , y = (CANVAS_HEIGHT / 2) + (GRASS_HEIGHT / 2) + WAYPOINT_OFFSET;
  var waypoints = [
    {x: x, y: y},
    {x: x + 1 * WAYPOINT_DISTANCE, y: y},
    {x: x + 2 * WAYPOINT_DISTANCE, y: y},
    {x: x + 3 * WAYPOINT_DISTANCE, y: y},
    {x: x + 4 * WAYPOINT_DISTANCE, y: y},
    {x: x + 5 * WAYPOINT_DISTANCE, y: y},
    {x: x + 6 * WAYPOINT_DISTANCE, y: y - 50},
    {x: x + 6.4 * WAYPOINT_DISTANCE, y: y - 130},
    {x: x + 6.25 * WAYPOINT_DISTANCE, y: y - 220},
    {x: x + 5 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x + 4 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x + 3 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x + 2 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x + 1 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x, y: y - 300},
    {x: x - 1 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x - 2 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x - 3 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x - 4 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x - 5 * WAYPOINT_DISTANCE, y: y - 300},
    {x: x - 6 * WAYPOINT_DISTANCE, y: y - 250},
    {x: x - 6.4 * WAYPOINT_DISTANCE, y: y - 170},
    {x: x - 6.25 * WAYPOINT_DISTANCE, y: y - 80},
    {x: x - 5 * WAYPOINT_DISTANCE, y: y},
    {x: x - 4 * WAYPOINT_DISTANCE, y: y},
    {x: x - 3 * WAYPOINT_DISTANCE, y: y},
    {x: x - 2 * WAYPOINT_DISTANCE, y: y},
    {x: x - 1 * WAYPOINT_DISTANCE, y: y}
  ];

  function init() {
    waypoints.forEach(function(item) {
      draw(item.x, item.y);
    });
  }

  function draw(x, y) {
    var point = new createjs.Shape();

    point.graphics
      .setStrokeStyle(1)
      .beginStroke("#FF0000")
      .drawCircle(0, 0, 1);
    point.x = x;
    point.y = y;

    stage.addChild(point);
  }

  function getWaypoints() {
    return waypoints;
  }

  return {
    init: init,
    getWaypoints: getWaypoints
  };
};