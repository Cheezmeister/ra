// Trigger
Crafty.c("Trigger", { 
  init: function() {
    this.requires('Collision');
    if (Game.debug) {
      this.requires('2DCanvasColor');
      this.requires('Adjustable');
      this.color('white');
    }
  },

  target: function(params) {
    return this;
  },

  collect: function(params) {
    this.onHit('Player', function(hitdata) {
      if (params.target) {
        var func = this[params.trigger];
        var target = Crafty(params.target);

        if (target && target[params.trigger]) {
          (target[params.trigger])(params.data);
        }
      } else {
        Crafty.trigger(params.trigger, params.data);
      }
      this.destroy();
    });
    return this;
  }
});

