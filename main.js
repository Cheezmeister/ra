var Game = {

  debug: false,
  smoketesting: false,

  width: 1200,
  height: 500,

  setTime: function(time) {
    this._lastTime = time;
  },

  start: function() {
    Crafty.init(6000, 1000);
    Crafty.background('rgb(127,127,127)');

    createComponents();

    // TODO can I control the event loop without dissecting crafty?
    var state = Game.smoketesting ? States.game : States.menu;
    state.start();
  }
};


if (Game.smoketesting) {
  window.setTimeout(function() {
    window.location.reload();
  }, 5000);
}
