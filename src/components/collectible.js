// Collectible
Crafty.c("Collectible", {
  init: function() {
    this.requires('Trigger');
  },
  powerup: function(name) {
    this.collect({
      target: 'Player',
      trigger: 'givePowerup',
      data: name
    });
    return this;
  }
});
