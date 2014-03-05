Crafty.extend({
  alias: function(alias, requires) {
    Crafty.c(alias, {
      init: function() {
        this.requires(requires);
      }
    });
  }
});
