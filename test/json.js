var proto = require('../index.js');
var test = require('tap').test;

var JsonType = proto.JsonType;

//-----
var type;

test("empty array", function (t) {
  type = new JsonType();
  var out = type.marshal({one: 1, two: 'two'})
  t.equals(out.one, 1)
  t.equals(out.two, 'two')
  t.end();
});
