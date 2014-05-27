var States = {
  menu: {
    start: function() {
      States.game.start();
    }
  },

  game: {
    end: function () {
      Crafty('*').destroy();
    },
    start: function() {

      // Update the text box with transient map json
      var updateMap = function() {
        document.getElementById('map').innerHTML = (EntMgr.write());
      };

      // Load a map from file
      var loadMap = function(file) {
        var loadFile = function(file) {
          var req = new XMLHttpRequest();
          req.open('GET', file, false);
          req.send(null);
          return req.responseText;
        };

        var json = loadFile('maps/' + file + '.json');
        EntMgr.parse(json);
      };

      // This may be overkill if releasing one map/track at a time
      loadMap('test');

      // Typically I'm not concerned with the musical experience 
      // when iterating, just that things aren't horrifically broken
      if (Game.smoketesting) {
        Crafty.audio.toggleMute();
      }

      // Audio Track 
      // TODO bind to map
      // TODO really need to assess browser codec support and deal with that
      Crafty.load(["assets/audio/test.mp3"], 
          function complete() {
          },
          function progress(e) {
          },
          function error(e) {
            alert( 'Oh noez! ' + e.src + ' failed to load!' );
          }
      );
      Crafty.audio.add('bgm', 'assets/audio/test.mp3');

      // Event handlers for global triggers. These might fit better
      // somewhere else, but will leave them here for now.
      Crafty.e('GlobalTriggers')
        .bind('MapEntsUpdated', function(data) {
          if (EntMgr.updateEnt(data.id)) {
            updateMap();
          }
        })
        .bind('Flash', function(data) {
          Crafty.background(data.color);
        })
        .bind('SpawnConfetti', function(data) {
          var confetti = Crafty.e("Confetti")
            .attr({
              x: data.x,
              y: data.y,
              w: data.w,
              h: data.h
          }).confetti();
        });

      var markColors = [
        'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
      ];
      var markIndex = 0;

      // Global keyboard events (dev)
      Crafty.e("Keyboard")
        .bind('KeyDown', function() {
          if        (this.isDown('P')) {
            Game.pseudopaused = !Game.pseudopaused;
          } else if (this.isDown('M')) {
            EntMgr.ent("Mark", {
              color: markColors[markIndex++ % markColors.length],
              attr: { 
                x: G.player._x,
                y: G.player._y - 80,
                w: 4,
                h: 120,
                time: new Date().getTime() - Game._lastTime
              }
            });
            updateMap();
          } else if (this.isDown('V')) {
            Crafty.audio.toggleMute();
          }
        });

      // Init map textbox
      updateMap();

      // Player spawns from here on spacebar or click
      var cannon = Crafty.e("SpawnCannon")
        .cannon(30, 5)
        .attr({x: 320, y: 150, w: 40, h: 40});

      // Camera
      // TODO variable browser width
      Crafty.viewport.init(Game.width, Game.height);
      Crafty.viewport.follow(cannon, 100, 100);

      if (Game.smoketesting) {
        cannon._fire();
      }
    }
  }
};


var EntMgr = {
  _ents : [],

  ent: function(comps, attributes) {
    var e = Crafty.e(comps);
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        var type = typeof(e[key]);
        if (type !== typeof(Function)) {
          console.log(key + " is a " + type + ", expected a function");
        } else {
          e = (e[key])(attributes[key]);
          if (e === undefined) {
            console.log("uh oh...wat u do?");
          }
        }
      }
    }
    this._ents[e.getId()] = { 
      comps: comps, 
      attributes: attributes 
    };
    return e;
  },

  ento: function(o) {
    if (!o) return null;
    return this.ent(o.comps, o.attributes);
  },

  updateEnt: function(id) {
    console.log("attempting to update ents");
    var craft = Crafty(id);
    if (!craft) {
      console.log("ent " + id + " was removed; do it yourself");
      return false;
    }
    var e = this._ents[id];
    if (!e) {
      console.log("no ent with id " + id + " found");
      return false;
    }
    for (var key in e.attributes.attr) {
      e.attributes.attr[key] = craft.attr(key);
    }
    return true;
  },

  write: function() {
    return JSON.stringify(this._ents, null, 2);
  },

  parse: function(json) {
    var ents = JSON.parse(json);
    for (var i = 0; i < ents.length; ++i) {
      this.ento(ents[i]);
    }
  }
};






