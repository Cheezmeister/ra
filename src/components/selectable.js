
// Selectable
Crafty.c('Selectable', {
  _selected: false,

  init: function() {
    this.requires('Mouse, 2DCanvasColor');
    this.bind('Click', function() {
      this.select('toggle');
      Crafty.trigger('Invalidate');
    });
    this.bind('MouseOver', function () {
      this._hovered = true;
      this.alpha = 0.5;
    });
    this.bind('MouseOut', function () {
      this._hovered = false;
      this.alpha = 1.0;
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
