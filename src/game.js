window.Game = {

  debug: false,
  smoketesting: false,
  components: {},

  width: 1200,
  height: 500,

  setTime: function(time) {
    this._lastTime = time;
  },

  start: function() {

    Crafty.init(6000, 1000);
    Crafty.background('rgb(0,127,127)');


    var elements = [
       "src/components/_misc"
      ,"src/components/player.js"
      ,"src/components/adjustable.js"
      ,"src/components/confetti.js"
      ,"src/components/laser.js"
      ,"src/components/metronome.js"
      ,"src/components/player.js"
      ,"src/components/selectable.js"
      ,"src/components/spawn_cannon.js"
      ,"src/components/trigger.js"
      ,"src/components/collectible.js"
    ];

    require(elements, function() {
      Crafty.alias('2DCanvasColor', '2D, Canvas, Color');
      Crafty.alias('AdjustableGround', 'Adjustable, Ground');
      Crafty.alias('Wall', 'Solid');
      Crafty.alias('Ground', 'Solid');

      require([ "src/scenes" ], function() {
        Crafty.scene('gameplay');
      });
    });

  }
};
