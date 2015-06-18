var Waypoint = function() {
  var waypoints = [];

  function draw(x, y) {
    instance = new createjs.Shape();

    instance.graphics
      .setStrokeStyle(1)
      .beginStroke("#000")
      .drawCircle(0, 0, radius);
    instance.x = x;
    instance.y = y;

    stage.addChild(instance);
  }

  function getWaypoints() {
    return waypoints;
  }

  return {
    draw: draw,
    getWaypoints: getWaypoints
  }
};