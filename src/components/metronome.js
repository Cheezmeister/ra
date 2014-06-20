
// Metronome
Crafty.c("Metronome", { 
  init: function() {
    this.requires('Collision');
  },
  metronome: function() {
    this.onHit('Player', function() {
      Game.setTime(this.attr("time"));
    });
    return this;
  }
});

