Crafty.c('Blob',  {
  init: function () {
    // TODO make it look more blobby
    this.requires('Enemy, 2DCanvasColor, Text, Shootable');
    this.color('#ff4444');
    this.one('EnterFrame', function () {
      this.text('shoot us!');
    });
    this.attr({w: 80, h: 16});
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

Crafty.c('Wall', {
  init: function () {
    this.requires('Solid, 2DCanvasColor');
    this.color('#000066');
  }
});

Crafty.c('Ground', {
  init: function () {
    this.requires('Solid, 2DCanvasColor');
    this.color('#111111');
  }
});

Crafty.c('Map', {
  init : function() {
    this.requires('2D, Canvas, Color');
    this.color('rgb(40,40,40)');
  }
});

