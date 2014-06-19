var G = { };
var createComponents = function() {

  Crafty.alias('2DCanvasColor', '2D, Canvas, Color');
  Crafty.alias('AdjustableGround', 'Adjustable, Ground');
  Crafty.alias('Wall', 'Solid');
  Crafty.alias('Ground', 'Solid');

  var spawnPlayer = function(xPos, yPos, angle, xVel) {
    //Player
    var params = { 
      x: xPos, y: yPos, w: 20, h: 20,
      dX: xVel,
      _gy: -xVel * Math.tan(angle)
    };
    var player = Crafty.e("Player").start(params);

    Crafty.viewport.follow(player, 0, 0, 300, 150);

    G.player = player;
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

  // Confetti
  Crafty.c("Confetti", {
    init: function() {
      this.requires('2DCanvasColor, Particles');
    },
    confetti: function() {
      var params = {
        max: 40,
        gravity: {x: 0, y: 0.1},
        duration: 200
      };

      this.particles({
        maxParticles: params.max,
        autoEmit: false, // Produce only the particles forced below
        duration: params.duration,
        size: 10,
        sizeRandom: 9,
        speedRandom: 10,
        lifeSpan: params.duration + 1,
        lifeSpanRandom: 200,
        startColour: [250, 150, 0, 10],
        endColour: [90, 50, 50, 100],
        fastMode: true,
        gravity: { x: 0.0, y: 0.1}
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
      if (Game.debug) {
        this.requires('2DCanvasColor');
        this.requires('Adjustable');
        this.color('white');
      }
    },

    target: function(params) {
      return this;
    },

    // TODO factor into Collectible component
    collect: function(params) {
      this.onHit('Player', function(hitdata) {
        if (params.target) {
          var func = this[params.trigger];
          var target = Crafty(params.target);

          if (target && target[params.trigger]) {
            (target[params.trigger])(params.data);
          }
          
        } else if (params.givepowerup) {
          G.player.givePowerup(params.givepowerup);
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

    // Initialization
    init: function() {
      this.requires("2D, Canvas, Color, Collision, Gravity, Keyboard");

      this.color('rgb(0,0,255)')
      .gravity('Ground')
      .gravityConst(0.4)
      .onHit('Wall', function() {
        this.dX = -this.dX;
      })
      .onHit('Ceiling', function() {
        this._gy = 0;
      })
      .onHit('Enemy', function () {
        this.die();
      })
      .onHit('Ground', function () {
        this._gy = 0;
      });
    },

    // Powerups given by collectibles
    givePowerup: function(comp) {
      this.addComponent(comp);
      this.color('purple');
    },

    // Update
    _playerStep: function() {
      if (Game.pseudopaused) return;
      var mult = 1; //Crafty.timer.steptype() == "variable" ? params.dt : 1;
      this.x += this.dX * mult;
    },

    // Zap attack
    _zap: function (dir) {
      Crafty.e('2DCanvasColor, Laser')
        .color('red')
        .duration(1000)
        .fire(this.x, this.y, dir);
    },

    die: function () {
      alert("oh noez, you died!");
    },

    // Parameters
    start: function(params) {
      this.attr(params);
      this.bind('EnterFrame', this._playerStep);

      // TODO stuff keybindings into a map for readibility/customization
      this.bind('KeyDown', function() {

        // Jump
        if (this.isDown('SPACE')) {
          this._gy = -6;
          this._falling = true;

        // Zap attack
        } else if (this.isDown('J') && this.has('Zapper')) {
          this._zap('left');
          this._zap('down');
          this._zap('up');
          this._zap('right');

        // Hold position (for editing)
        } else if (this.isDown('E')) {
          this.dX = (this.dX ? 0 : params.dX);
        }
      });
      return this;
    }
  });

  Crafty.c('Laser', {
    init: function() {
      this.requires('Collision, 2DCanvasColor');
      this.onHit('Wall', function (param) {
      });
    },

    duration: function (millis) {
      this._life = millis;
      this.bind('EnterFrame', function (o) {
        this._life -= o.dt;
        if (this._life < 0) {
          this.destroy();
        } else {
          this.alpha = this._life / millis;
        }



        var hit = this.hit('Solid');
        var bottom = this.y + this.h;
        if (hit) {
          for (var i = 0, len = hit.length; i < len; i++) {
            if (this._direction === 'left') {
              this.x = Math.max(this.x, hit[i].obj.x + hit[i].obj.w);
              this.w = this._origX - this.x;
            } else if (this._direction === 'right') {
              this.w = Math.min(this.x + this.w, hit[i].obj.x) - this.x;
            } else if (this._direction === 'up') {
              this.y = Math.max(this.y, hit[i].obj.y + hit[i].obj.h);
              this.h = this._origY - this.y;
            } else if (this._direction === 'down') {
              this.h = Math.min(this.y + this.h, hit[i].obj.y) - this.y;
            }
          }
          this.color('green');
        }

      });
      return this;
    },

    fire: function (origX, origY, up_down_left_right) {
      var x = origX, y = origY;
      var w = 2, h = 2;

      this._direction = up_down_left_right;
      this._origX = origX;
      this._origY = origY;
      switch (up_down_left_right) {
        case 'up':
          h = 1000; y -= h; break;
        case 'down':
          h = 1000; break;
        case 'left':
          w = 1000; x -= w; break;
        case 'right':
          w = 1000; break;
        default:
          BS.assert(false, up_down_left_right + " is not a direction!");
      }
      this.attr({x: x, y: y, w: w, h: h});

    }
  });

  Crafty.c('Blob',  {
    init: function () {
      // TODO make it look more blobby
      this.requires('Enemy, 2DCanvasColor, Shootable');
      this.attr({w: 80, h: 4});
      this.bind('Destroy', function () {
        Game.score++;
      });
    }
  });


  Crafty.c('Enemy',  {
    init: function () {
            // TODO
    }
  });

  Crafty.c('Shootable', {
    init: function() {
      this.requires('Collision');
      this.onHit('Laser', function() {
        this.destroy();
      });
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
