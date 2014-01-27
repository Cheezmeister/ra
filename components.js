var G = { };
var createComponents = function() {

  var spawnPlayer = function(xPos, yPos, angle, vel) {
    //Player
    var player = Crafty.e("2D, Canvas, Color, Collision, Gravity, Keyboard")
      .color('rgb(0,0,255)')
      .gravity('Ground')
      .attr({ x: xPos, y: yPos, w: 20, h: 20,
        dX: vel * Math.cos(angle),
        _gy: -vel * Math.sin(angle)
      })
      .bind('EnterFrame', function () {
        this.x += this.dX;
      })
      .bind('KeyDown', function() {
        if (this.isDown('SPACE')) {
          this._gy = -4;
          this._falling = true;
        } else if (this.isDown('R')) {
          this.x = xPos;
          this.y = yPos;
        }
      })
      .onHit('Wall', function() {
        this.dX = -this.dX;
      })
      .onHit('Ground', function () {
        this._gy = 0;
      });
    Crafty.viewport.follow(player, 100, 100);
    G.player = player;
  };

  Crafty.c("SpawnCannon", {

    init : function() {
      this.requires('2D, Canvas, Keyboard, Color');
      this.color('rgb(50, 0, 150)');
      this.bind('KeyDown', function() {
        if (this.isDown('SPACE')) {
          spawnPlayer(this._x, this._y, this._cannonAngle, this._cannonvel);
          this.destroy();
        }
      });
    },
    cannon: function(angle, vel) {
      this._cannonAngle = angle * Math.PI / 180;
      this._cannonvel = vel;
      return this;
    }
  });

  Crafty.c('Powerup', {
    
  });

  Crafty.c('Map', {
    init : function() {
      this.requires('2D, Canvas, Color');
      this.color('rgb(40,40,40)');
    }
  });

};
