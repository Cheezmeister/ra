Crafty.c('Parallax', {
  init: function () {
    this.requires('2D, Image');
  },
  layer: function (z) {
    this.z = z;
    var exp = Math.pow(2, z);
    var overlap = 640;
    this.bind('EnterFrame', function () {
      var x = Crafty.viewport.x * exp;
      if (x + Crafty.viewport.x < -overlap) {
        x += overlap;
      }
      this.x = x;
    });
//    this.unbind('Draw');
//    this.bind('Draw', this._drawParallax);
    return this;
  },
  _drawParallax: function (drawVars) {
    var ctx = drawVars.ctx;
    var w = Crafty.viewport.width;
    var h = Crafty.viewport.height;
    var repeat = 200;
    ctx.fillColor = 'green';
    ctx.lineColor = 'green';
    for (var i = 0; i <= w; i += repeat) {
      ctx.moveTo(i, h);
      ctx.lineTo(i + repeat, 0);
    }
    ctx.stroke();
  } 
});
