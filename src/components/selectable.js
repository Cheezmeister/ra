
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
