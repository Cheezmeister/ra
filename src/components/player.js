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


