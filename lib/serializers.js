// Interfaces to data serializers. 
// Each provides parse, dump, and the underlying implementation.
window.Serializers = {
  yaml: {
    impl: require('vendor/js-yaml'),
    parse: function(yaml) {
      return this.impl.load(yaml);
    },
    dump: function(data) {
      return this.impl.dump(data);
    }
  },
  json: {
    impl: JSON,
    parse: function(json) {
      return this.impl.parse(json);
    },
    dump: function(data) {
      return this.impl.stringify(data, null, 2) + '\n';
    }
  }
};

