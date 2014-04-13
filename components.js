var G = { };
var createComponents = function() {

  Crafty.alias('2DCanvasColor', '2D, Canvas, Color');
  Crafty.alias('AdjustableGround', 'Adjustable, Ground');
  // Crafty.alias('Ground', '2DCanvasColor, Adjustable');

  var spawnPlayer = function(xPos, yPos, angle, vel) {
    //Player
    var params = { 
      x: xPos, y: yPos, w: 20, h: 20,
      dX: vel * Math.cos(angle),
      _gy: -vel * Math.sin(angle)
    };
    var player = Crafty.e("Player").start(params);

    // Clamping every frame is expensive and we don't need it
    Crafty.viewport.follow(player, 0, 0, 300, 150);
    Crafty.viewport.clampToEntities = false;

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
      this.requires('2D, Mouse, Canvas, Keyboard, Color');
      this.color('blue');
      this.bind('Click', function() {
        this._fire();
      });
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
      this.requires('2DCanvasColor, RaParticles');
    },
    confetti: function() {
      var params = {
        max: 2,
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
      this.one('EndFrame', function() {
        this.destroy();
      });
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
        Game.setTime(this.attr("time"));
      });
      return this;
    }
  });

  // Adjustable
  Crafty.c("Adjustable", {
    init: function() {
      this.requires('Selectable, Keyboard');
      this.bind('KeyDown', function() {
        if (!this._selected) return;

        var amt = 1;
        if (this.isDown('SHIFT')) amt *= 4;
        if (this.isDown('CTRL')) amt *= 16;

        if (this.isDown('DELETE')) {
          this.destroy();
        } else if (this.isDown('W')) {
          this.y = this._y - amt;
          this.h = this._h + amt;
        } else if (this.isDown('S')) {
          this.y = this._y + amt;
          this.h = this._h - amt;
        } else if (this.isDown('UP_ARROW')) {
          this.h = this._h - amt;
        } else if (this.isDown('DOWN_ARROW')) {
          this.h = this._h + amt;
        } else if (this.isDown('A')) {
          this.x = this._x - amt;
          this.w = this._w + amt;
        } else if (this.isDown('D')) {
          this.x = this._x + amt;
          this.w = this._w - amt;
        } else if (this.isDown('LEFT_ARROW')) {
          this.w = this._w - amt;
        } else if (this.isDown('RIGHT_ARROW')) {
          this.w = this._w + amt;
        } else return;

        Crafty.trigger('MapEntsUpdated', {id: this[0]} );
        Crafty.trigger('Invalidate');
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
        this.select('toggle');
        Crafty.trigger('Invalidate');
      });
      this.bind('Draw', function(e) {
        if (!this._selected) return;
        e.ctx.strokeStyle = (this._color === '#000000' ? '#ffffff' : '#000000');
        e.ctx.strokeRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
      });
    },

    select: function(on) {
      if (this._selected === on) return;
      this._selected = ((on === 'toggle') ? !this._selected : on);
    }
 
  });

  Crafty.c('Player', {
    init: function() {
      this.requires("2D, Canvas, Color, Collision, Gravity, Keyboard");

      this.color('rgb(0,0,255)')
      .gravity('Ground')
      .onHit('Wall', function() {
        this.dX = -this.dX;
      })
      .onHit('Ground', function () {
        this._gy = 0;
      });
    },

    _playerStep: function() {
      var mult = 1; //Crafty.timer.steptype() == "variable" ? params.dt : 1;
      this.x += this.dX * mult;
    },

    start: function(params) {
      this.attr(params);
      this.bind('EnterFrame', this._playerStep);
      this.bind('KeyDown', function() {
        if (this.isDown('SPACE')) {
          this._gy = -4;
          this._falling = true;
        } else if (this.isDown('H')) {
          this.dX = 0;
        }
      });
      return this;
    }
  });

  Crafty.c('Mark', {
    init: function() {
      if (Game.debug) {
        this.requires('Adjustable, 2DCanvasColor');
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
