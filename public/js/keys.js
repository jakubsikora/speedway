function Keys() {
  var up = false
    , down = false
    , left = false
    , right = false
    , action = false;

  var onKeyDown = function(e) {
    var that = this;

    switch(e.keyCode) {
      case 38:
        that.up = true;
        break;
      case 40:
        that.down = true;
        break;
      case 37:
        that.left = true;
        break;
      case 39:
        that.right = true;
        break;
      case 32:
        that.action = true;
        break;
    }
  }

  var onKeyUp = function(e) {
    var that = this;

    switch(e.keyCode) {
      case 38:
        that.up = false;
        break;
      case 40:
        that.down = false;
        break;
      case 37:
        that.left = false;
        break;
      case 39:
        that.right = false;
        break;
      case 32:
        that.action = false;
        break;
    }
  }

  return {
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    up: up,
    left: left,
    right: right,
    down: down,
    action: action
  }
}