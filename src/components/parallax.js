Crafty.c('Parallax', {
  init: function () {
    this.requires('2D, Image');
  },
  layer: function (z) {
    this.z = z;
    var exp = Math.pow(2, z);
    this.bind('EnterFrame', function () {
      this.x = Crafty.viewport.x * 0.2;
    });
    return this;
  },
  _drawParallax: function (drawVars) {
    drawVars.ctx.fillColor = 'green';
  } 
});
