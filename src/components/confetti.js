
// Confetti
Crafty.c("Confetti", {
  init: function() {
    this.requires('2DCanvasColor, Particles');
  },
  confetti: function() {
    var params = {
      max: 80,
      gravity: {x: 0, y: 0.1},
      duration: 100
    };

    this.particles({
      maxParticles: params.max,
      autoEmit: false, // Produce only the particles forced below
      duration: params.duration,
      size: 10,
      sizeRandom: 9,
      speedRandom: 10,
      lifeSpan: params.duration + 1,
      lifeSpanRandom: 100,
      startColour: [250, 150, 0, 10],
      endColour: [90, 50, 50, 100],
      fastMode: true,
      gravity: { x: 0.0, y: 0.1}
    });

    return this;
  }
});

