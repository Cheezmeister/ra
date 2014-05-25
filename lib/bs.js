
// Bullshit utils that should come standard with the bloody language
var BS = {

  // Barebones assertion. Not sure I really need this?
  assert: function (condition, msg, func) {
    if (!condition) {
      if (func && typeof(func) === typeof(Function)) {
        func(msg);
      } else {
        throw 'assert failed: ' + (msg || '(no detail)');
      }
    }
  },

  // http://stackoverflow.com/a/2117523
  guid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
};

