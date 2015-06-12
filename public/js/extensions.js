createjs.Sprite.prototype.reverse = function() {
    var currentFrame = this._currentFrame
        , numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);

    if (currentFrame <= 0) {
        currentFrame = numFrames - 1;
    } else {
        currentFrame--;
    }

    this.gotoAndStop(currentFrame);
};

createjs.Sprite.prototype.forward = function() {
    var currentFrame = this._currentFrame
        , numFrames = this.spriteSheet.getNumFrames(this.currentAnimation);

    if (currentFrame >= numFrames) {
        currentFrame = 0;
    } else {
        currentFrame++;
    }

    this.gotoAndStop(currentFrame);
};
