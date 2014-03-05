var G = { };
var createComponents = function() {

  var spawnPlayer = function(xPos, yPos, angle, vel) {
    //Player
    var player = Crafty.e("Player, 2D, Canvas, Color, Collision, Gravity, Keyboard")
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
    Crafty.audio.play('bgm');
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

  Crafty.c("Trigger", { 
    init: function() {
      this.requires('Collision');
    },

    collect: function(params) {
      this.onHit('Player', function() {
//         Crafty.trigger(params.trigger, params.data);
        var confetti = Crafty.e("2D, Canvas, Color, Particles")
          .attr({x: 400, y: 100, w: 4, h: 4})
          .particles({
            maxParticles: 50,
            // Produce only the particles forced below
            duration: 900,
            size: 10,
            sizeRandom: 9,
            speedRandom: 10,
            lifeSpan: 901,
            lifeSpanRandom: 200,
            startColour: [250, 50, 0, 10],
            endColour: [50, 250, 250, 100],
            fastMode: true,
            gravity: { x: 0.1, y: 0}
          });
        for (var i = 0; i < 50; ++i) {
          confetti._Particles.addParticle();
        }
        this.destroy();
      });
      return this;
    }
  });

  Crafty.c('Map', {
    init : function() {
      this.requires('2D, Canvas, Color');
      this.color('rgb(40,40,40)');
    }
  });

};
