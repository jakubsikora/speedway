var canvas
  , stage
  , img = new Image()
  , sprite
  , leftHeld
  , rightHeld
  , keyDown = false
  , currentFrame;

function init() {
  setEventHandlers();

  canvas = document.getElementById('canvas');
  stage = new createjs.Stage(canvas);
  img.onload = handleImageLoad;
  img.src = 'http://i.imgur.com/bDBYSbr.png';
}

function handleImageLoad(e) {
  var spriteSheet = new createjs.SpriteSheet({
    // image to use
    images: [img],
    // width, height & registration point of each sprite
    frames: {
      width: 42,
      height: 42,
      regX: 21,
      regY: 21
    }
  });

  sprite = new createjs.Sprite(spriteSheet);
  sprite.regX = sprite.spriteSheet.frameWidth / 2 | 0;
  sprite.regY = sprite.spriteSheet.frameHeight / 2 | 0;
  sprite.gotoAndStop(16);

  currentFrame = sprite.currentFrame;

  sprite.x = canvas.width / 2;
  sprite.y = canvas.height / 2;

  sprite.scaleX = 2;
  sprite.scaleY = 2;

  stage.addChild(sprite);
  createjs.Ticker.addEventListener("tick", tick);
}

function tick() {
  if (leftHeld) {
    //sprite.x =
  }

  if (rightHeld) {
    //sprite.x =
  }

  if (leftHeld) {
    sprite.reverse();
    keyDown = true;
  }

  if (rightHeld) {
    sprite.forward();
    keyDown = true;
  }

  stage.update();
}

function setEventHandlers() {
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);
}

function onKeydown(e) {
  switch(e.keyCode) {
    case 37:
      leftHeld = true;
      break;
    case 39:
      rightHeld = true;
      break;
  }
}

function onKeyup(e) {
  switch(e.keyCode) {
    case 37:
      leftHeld = false;
      keyDown = false;
      currentFrame = sprite.currentFrame;
      sprite.stop();
      break;
    case 39:
      rightHeld = false;
      keyDown = false;
      currentFrame = sprite.currentFrame;
      sprite.stop();
      break;
  }
}


createjs.Sprite.prototype.reverse = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame <= 0) {
        currentFrame = numFrames - 1;
    } else {
        -- currentFrame;
    }
    this.gotoAndStop(currentFrame);
};

createjs.Sprite.prototype.forward = function() {
    var currentFrame = this._currentFrame;
    var numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);
    if (currentFrame >= numFrames) {
        currentFrame = 0;
    } else {
        ++ currentFrame;
    }
    this.gotoAndStop(currentFrame);
};