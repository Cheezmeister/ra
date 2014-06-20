
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

