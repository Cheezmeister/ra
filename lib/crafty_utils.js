define(["vendor/crafty"], function() {
  Crafty.extend({
    // Shorthand for aliasing sets of commonly used components
    alias: function(alias, requires) {
      Crafty.c(alias, {
        init: function() {
          this.requires(requires);
        }
      });
    },

    // Singleton entity (e.g. player)
    s: function(comps) {
      var ret = Crafty(comps);
      if (ret.__c) return ret;
      if (ret.length > 1) throw "Multiple " + comps + " already created";
      return Crafty.e(comps);
    }
  });
});
