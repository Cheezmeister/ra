require(["vendor/js-yaml", "vendor/json2", "vendor/crafty"], function() {
  require(["lib/bs", "lib/serializers", "lib/crafty_utils", "src/game"], function() {
    Game.start();
  });
});
