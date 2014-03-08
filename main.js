var EntMgr = {
  _ents : [],

  ent: function(comps, attributes) {
    var e = Crafty.e(comps);
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        var type = typeof(e[key]);
        if (type !== typeof(Function)) {
          console.log(key + " is a " + type + ", expected a function");
        }
        e = (e[key])(attributes[key]);
      }
    }
    this._ents.push({ 
      comps: comps, 
      attributes: attributes 
    });
    return e;
  },
  ento: function(o) {
    return this.ent(o.comps, o.attributes);
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

var updateMap = function() {
  document.getElementById('map').innerHTML = (EntMgr.write());
};

var loadFile = function(file) {
  var req = new XMLHttpRequest();
  req.open('GET', file, false);
  req.send(null);
  return req.responseText;
};

var loadMap = function(file) {
  var json = loadFile('maps/' + file + '.json');
  EntMgr.parse(json);
};

var Game = {

  debug: true,
  devMode: false,

  start: function() {
    Crafty.init(6000, 300);
    Crafty.background('rgb(127,127,127)');

    createComponents();

    loadMap('test');
    if (Game.debug) {
      Crafty.audio.toggleMute();
    }

    // Audio Track TODO bind to map
    Crafty.audio.add('bgm', 'assets/audio/test.ogg');
    Crafty.load(["assets/audio/test.ogg"], 
        function complete() {
        },
        function progress(e) {
        },
        function error(e) {
        }
    );

    Crafty.e('GlobalTriggers')
      .bind('SpawnConfetti', function(data) {
        var confetti = Crafty.e("Confetti")
          .attr({
            x: data.x,
            y: data.y,
            w: data.w,
            h: data.h
        }).confetti();
      });

    // Global keyboard events (dev)
    Crafty.e("Keyboard")
      .bind('KeyDown', function() {
        if (this.isDown('A')) {
          EntMgr.ent("Mark, 2D, Canvas, Color", {
            color: 'rgb(240, 0, 240)',
            attr: { 
              x: G.player._x,
              y: G.player._y,
              w: 4,
              h: 4,
              time: event.timestamp || new Date().getTime()
            }
          });
          updateMap();
        } else if (this.isDown('M')) {
          Crafty.audio.toggleMute();
        }
      });

    updateMap();

    var cannon = Crafty.e("SpawnCannon")
      .cannon(30, 5)
      .attr({x: 300, y: 150, w: 40, h: 40});

    // Camera
    // TODO variable browser width
    Crafty.viewport.init(1200, 500);
    Crafty.viewport.bounds = null;
    Crafty.viewport.follow(cannon, 100, 100);

    if (Game.devMode) {
      cannon._fire();
    }
  }
};

window.addEventListener('load', Game.start);

if (Game.devMode) {
  window.setTimeout(function() {
    window.location.reload();
  }, 5000);
}
