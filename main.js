var EntMgr = {
  _ents : [],

  ent: function(comps, attributes) {
    var e = Crafty.e(comps);
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key)) {
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

  start : function() {
    Crafty.init(6000, 300);
    Crafty.background('rgb(127,127,127)');

    createComponents();

    loadMap('test');
 
    Crafty.e("Keyboard")
      .bind('KeyDown', function() {
        if (this.isDown('A')) {
          EntMgr.ent("Mark, 2D, Canvas, Color", {
            color: 'rgb(240, 0, 240)',
            attr: { 
              x: G.player._x,
              y: G.player._y,
              w: 4,
              h: 4
            }
          });
          updateMap();
        }
      });

    updateMap();

    var cannon = Crafty.e("SpawnCannon")
      .cannon(30, 5)
      .attr({x: 300, y: 150, w: 40, h: 40});

    // Camera
    Crafty.viewport.init(600, 300);
    Crafty.viewport.bounds = null;
    Crafty.viewport.follow(cannon, 100, 100);

    //Score boards
    Crafty.e("LeftPoints, DOM, 2D, Text")
        .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
         .text("0 Points");
    Crafty.e("RightPoints, DOM, 2D, Text")
        .attr({ x: 515, y: 20, w: 100, h: 20, points: 0 })
        .text("0 Points");

  }
};

window.addEventListener('load', Game.start);
