Crafty.c('Player', {

  // Initialization
  init: function() {
    this.requires("2D, Canvas, Color, Collision, Gravity, Keyboard");
    //
    // TODO stuff keybindings into a map for readibility/customization
    this.bind('KeyDown', this._handleInput);

    this.bind('EnterFrame', this._playerStep);

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

    this.onHit('Ceiling', function() {
      this._gy = 0;
    })
    this.gravity('Ground').gravityConst(0.4).bind('hit', function () {
      this._gy = 0;
    });

    this.onHit('Wall', function(hitdata) {
      var hd = hitdata[0];
      if (hd && hd.obj.has('Bashable') && this.powerups.has('Juggernaut')) {
        hd.obj.destroy();
        return;
      }
      this.dX = -this.dX;
    })
    .onHit('Enemy', function () {
      this.die();
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

  // Input
  _handleInput: function() {

    // Jump
    if (this.isDown('SPACE')) {
      this._gy = -6;
      this._falling = true;
      this.active = true;

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
      this.dX = (this.dX ? 0 : this._params.dX);
    }
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
      .color('green')
      .duration(1000)
      .fire(this.center.x, this.center.y, dir);
  },

  die: function () {
    alert("oh noez, you died!");
  },

  // Parameters
  start: function(params) {
    this._params = params;
    this.attr(params);

    return this;
  }
});


