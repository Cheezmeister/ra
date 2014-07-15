
var spawnPlayer = function(xPos, yPos, angle, xVel) {

  var player = Game.player = Crafty.e("Player").start({ 
    x: xPos, y: yPos, w: 20, h: 20,
    dX: xVel,
    _gy: -xVel * Math.tan(angle)
  });

  Crafty.viewport.follow(player, 0, 0, 0, 0);
  Crafty.viewport.clampToEntities = false;

  // This works inconsistently on Chrome. Seems like a race condition.
  // Crafty.audio.play('bgm');
  // But this works fine
  Crafty.audio.sounds.bgm.obj.play();
};

// SpawnCannon
Crafty.c("SpawnCannon", {

  _fire: function() {
    console.log("here" + Crafty.viewport.clampToEntities);
    spawnPlayer(this._x, this._y, this._cannonAngle, this._cannonHVel);
    this.destroy();
  },
  init : function() {
    this.requires('2D, Mouse, Canvas, Keyboard, Color');
    this.color('green');
    this.bind('Click', function() {
      this._fire();
    });
    this.bind('KeyDown', function() {
      if (this.isDown('SPACE')) {
        this._fire();
      }
    });
  },
  angle: function (a) {
    this._cannonAngle = a * Math.PI / 180;
    return this;
  },
  vel: function (hVel) {
    this._cannonHVel = hVel;
    return this;
  }
});

