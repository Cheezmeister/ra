
var spawnPlayer = function(xPos, yPos, angle, xVel) {

  var player = Crafty.e("Player").start({ 
    x: xPos, y: yPos, w: 20, h: 20,
    dX: xVel,
    _gy: -xVel * Math.tan(angle)
  });

  Crafty.viewport.follow(player, 0, 0, 300, 150);

  Game.player = player;
  Crafty.audio.play('bgm');
};

// SpawnCannon
Crafty.c("SpawnCannon", {

  _fire: function() {
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

