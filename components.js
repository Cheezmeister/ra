var G = { };
var createComponents = function() {

  Crafty.alias('2DCanvasColor', '2D, Canvas, Color');

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

  // SpawnCannon
  Crafty.c("SpawnCannon", {

    _fire: function() {
      spawnPlayer(this._x, this._y, this._cannonAngle, this._cannonvel);
      this.destroy();
    },
    init : function() {
      this.requires('2D, Canvas, Keyboard, Color');
      this.color('rgb(50, 0, 150)');
      this.bind('KeyDown', function() {
        if (this.isDown('SPACE')) {
          this._fire();
        }
      });
    },
    cannon: function(angle, vel) {
      this._cannonAngle = angle * Math.PI / 180;
      this._cannonvel = vel;
      return this;
    }
  });

  // Confetti
  Crafty.c("Confetti", {
    init: function() {
      this.requires('2DCanvasColor, Particles');
    },
    confetti: function() {
      var params = {
        max: 50,
        gravity: {x: 0, y: 0.1},
        duration: 900
      };
      this.particles({
        maxParticles: params.max,
        // Produce only the particles forced below
        duration: params.duration,
        size: 10,
        sizeRandom: 9,
        speedRandom: 10,
        lifeSpan: params.duration + 1,
        lifeSpanRandom: 200,
        startColour: [250, 50, 0, 10],
        endColour: [50, 250, 250, 100],
        fastMode: true,
        gravity: { x: 0.0, y: 0.1}
      });
      for (var i = 0; i < this._Particles.maxParticles; ++i) {
        this._Particles.addParticle();
      }
      return this;
    }
  });

  // Metronome
  Crafty.c("Metronome", { 
    init: function() {
      this.requires('Collision');
    },
    metronome: function() {
      this.onHit('Player', function() {
        Game.time = this.attr('time');
      });
    }
  });

  // Trigger
  Crafty.c("Trigger", { 
    init: function() {
      this.requires('Collision');
    },

    target: function(params) {
      return this;
    },

    collect: function(params) {
      this.onHit('Player', function() {
        if (params.target) {
          var func = this[params.trigger];
          var target = Crafty(params.target);

          if (target && target[params.trigger]) {
            (target[params.trigger])(params.data);
          }
          
        } else {
          Crafty.trigger(params.trigger, params.data);
        }
        this.destroy();
      });
      return this;
    }
  });

  // Selectable
  Crafty.c('Selectable', {
    _selected: false,

    init: function() {
      this.requires('Mouse, 2DCanvasColor');
      this.bind('Click', function() {
        this.select(!this._selected);
      });
    },

    select: function(on) {
      if (_selected === on) return;
      _selected = on;
    }

  });

  Crafty.c('Mark', {
    init: function() {
      if (G.debug) {
        this.requires('2DCanvasColor');
      }
    }
  });

  Crafty.c('Map', {
    init : function() {
      this.requires('2D, Canvas, Color');
      this.color('rgb(40,40,40)');
    }
  });

};
