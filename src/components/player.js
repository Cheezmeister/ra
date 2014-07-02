Crafty.c('Player', {

  // Initialization
  init: function() {
    this.requires("2D, Canvas, Color, Collision, Gravity, Keyboard");

    // TODO should go in Crafty or crafty_utils
    Object.defineProperties(this, {
      center: {
        get: function() {
          return {
            x: this._x + this._w / 2,
            y: this._y + this._h / 2
          };
        }
      }
    });

    // Da ba dee, da ba die
    this.color('rgb(0,0,255)');

    this.powerups = Crafty.e('Powerups');

    this.gravity('Ground').gravityConst(0.4)
    .onHit('Wall', function(hitdata) {
      var hd = hitdata[0];
      if (hd && hd.obj.has('Bashable') && this.powerups.has('Juggernaut')) {
        hd.obj.destroy();
        return;
      }
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
    var colormap = {
      Zapper: 'purple',
      Juggernaut: 'orange'
    };
    this.powerups.addComponent(comp);
    this.color(colormap[comp]);
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
      .fire(this.center.x, this.center.y, dir);
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
      } else if (this.isDown('J')) {
        if (this.powerups.has('Zapper')) {
          this._zap('left');
          this._zap('down');
          this._zap('up');
          this._zap('right');
        } else {
          this._zap(this.dX > 0 ? 'right' : 'left');
        }

      // Hold position (for editing)
      } else if (this.isDown('E')) {
        this.dX = (this.dX ? 0 : params.dX);
      }
    });
    return this;
  }
});


