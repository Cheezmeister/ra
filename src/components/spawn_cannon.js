
var spawnPlayer = function(xPos, yPos, angle, xVel) {

  var player = Game.player = Crafty.s("Player");
  player.start({ 
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
    spawnPlayer(this._x, this._y, this._cannonAngle, this._cannonHVel);
    this.unbind('KeyDown');
    this.unbind('Click');
    this.bind('KeyDown', function() {
      if (this.isDown('R')) {
        Crafty.audio.sounds.bgm.obj.currentTime = 0;
        Crafty.audio.sounds.bgm.obj.pause();
        this._fire();
      }
    });
  },
  init : function() {
    this.requires('2D, Mouse, Fourway, Canvas, Keyboard, Color');
    this.fourway(5);
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

