
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
