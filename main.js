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
        }
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

  width: 1200,
  height: 500,

  setTime: function(time) {
    this._lastTime = time;
    this._timer.text(time);
  },

  start: function() {
    Crafty.init(6000, 1000);
    Crafty.background('rgb(127,127,127)');

    createComponents();

    loadMap('test');
    if (Game.devMode) {
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

    // Global keyboard events (dev)
    Crafty.e("Keyboard")
      .bind('MapUpdated', function() {
        updateMap();
      })
      .bind('KeyDown', function() {
        if (this.isDown('M')) {
          EntMgr.ent("Mark, 2D, Canvas, Color, MapEntity", {
            color: 'rgb(240, 0, 240)',
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

    updateMap();

    Game._timer = Crafty.e('2D, DOM, Text')
      .attr({x: 100, y: 100})
      .text(0);

    var cannon = Crafty.e("SpawnCannon")
      .cannon(30, 5)
      .attr({x: 300, y: 150, w: 40, h: 40});

    // Camera
    // TODO variable browser width
    Crafty.viewport.init(Game.width, Game.height);
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
