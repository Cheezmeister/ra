// Entity manager, really just handles persisting ents
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
            console.log("You forgot to return this for one of (" + comps + ")");
          }
        }
      }
    }
    this._ents[e.getId()] = { 
      comps: comps, 
      attributes: attributes 
    };
    // console.log("Successfully added ent (" + comps + ")");
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

  write: function(serializer) {
    var c = serializer || this.serializer || Serializers.yaml;
    return c.dump(this._ents);
  },

  parse: function(text, serializer) {
    var c = serializer || this.serializer || Serializers.yaml;
    var ents = c.parse(text);
    for (var i = 0; i < ents.length; ++i) {
      this.ento(ents[i]);
    }
  }
};

// Game states, or "scenes" as Crafty calls them. Menu is rather bare at the moment :)
var States = {
  menu: {
    start: function() {
      Crafty.enterScene('gameplay');
    }
  },

  gameplay: {
    end: function () {
      Crafty('*').destroy();
    },
    start: function() {

      // Update the text box with transient map json
      var updateMap = function() {
        var text = EntMgr.write();
        var uri = 'data:text/plain,' + encodeURIComponent(text);
        document.getElementById('map').innerHTML = text;
        document.getElementById('save').setAttribute('href', uri);
        document.getElementById('save').setAttribute('download', 'test.yml');
      };

      // Load a map from file
      var loadMap = function(file, onComplete) {
        var loadFile = function(file, onBegin, onComplete) {
          var req = new XMLHttpRequest();
          req.onreadystatechange = function(a) {
            if (req.readyState == 3) {
              onBegin(a);
            } else if (req.readyState == 4) {
              onComplete(req.responseText);
            }
          };
          req.open('GET', file, true);
          req.send(null);
          return ;
        };

        var fmt = 'yaml';
        loadFile('maps/' + file + '.' + 'yml', 
          function started(arg) {
          },
          function ended(data) {
            EntMgr.parse(data, Serializers[fmt]);
            if (onComplete) onComplete();
          } 
        );
      };

      Crafty.e('Parallax, Canvas')
        .attr({x: 0, y: 0, w: 1920, h: 1200})
        .image('assets/images/squiggle.png', 'repeat')
        .layer(-2);


      // Typically I'm not concerned with the musical experience 
      // when iterating, just that things aren't horrifically broken
      if (Game.smoketesting) {
        Crafty.audio.toggleMute();
      }

      // Audio Track 
      // TODO bind to map
      // TODO really need to assess browser codec support and deal with that
      var assets = {
        audio: {
          bgm: ["test.mp3", "test.ogg", "test.flac"]
        }
      };
      Crafty.load(assets, 
          function complete() {
            console.log('Assets loaded properly');
          },
          function progress(e) {
            console.log('.');
          },
          function error(e) {
            console.log( 'Oh noez! ' + e.src + ' failed to load!' );
          }
      );

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
          var confetti = Crafty("Confetti");
          if (!confetti || !confetti.length) {
            confetti = Crafty.e("Confetti");
            confetti.confetti();
          }

          confetti.pulse({
            position: {
              x: data.x,
              y: data.y,
              w: data.w,
              h: data.h
            }
          });
          
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
          } else if (this.isDown('D')) {
            Game.debug = !Game.debug;
          } else if (this.isDown('M')) {
            EntMgr.ent("Mark", {
              color: markColors[markIndex++ % markColors.length],
              attr: { 
                x: Game.player._x,
                y: Game.player._y - 80,
                w: 4,
                h: 120,
                time: new Date().getTime() - Game._lastTime
              }
            });
            updateMap();
          } else if (this.isDown('PLUS')) {
            // Seriously guys?
            // Crafty.audio.toggleMute();
            var o = Crafty.audio.sounds.bgm.obj;
            o.volume = Math.min(o.volume + 0.1, 1);
          } else if (this.isDown('MINUS')) {
            console.log('lowering');
            var o = Crafty.audio.sounds.bgm.obj;
            o.volume = Math.max(o.volume - 0.1, 0);
          }
        });

      // Init map textbox
      updateMap();

      // Camera params (Clamping is mad expensive and we don't need it)
      // TODO variable browser width
      Crafty.viewport.init(Game.width, Game.height);
      Crafty.viewport.clampToEntities = false;

      // This may be overkill if releasing one map/track at a time
      loadMap('test', function follow() {
        // Player spawns from here on spacebar or click
        var cannon = Crafty("SpawnCannon")[0];
        if (!cannon) { 
          console.log("Map must contain a SpawnCannon");
          return;
        }

        Crafty.viewport.follow(cannon, 0, 0, 300, 150);
        if (Game.smoketesting) {
          cannon._fire();
        }
      });
    }
  }
};

for (var s in States) {
  if (States.hasOwnProperty(s)) {
    Crafty.scene(s, States[s].start, States[s].end);
  }
}

