Crafty.extend({
  // Shorthand for aliasing sets of commonly used components
  alias: function(alias, requires) {
    Crafty.c(alias, {
      init: function() {
        this.requires(requires);
      }
    });
  }
});
