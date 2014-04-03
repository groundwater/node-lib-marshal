var proto = require('../index.js');
var test = require('tap').test;

var MapType = proto.MapType;

//-----
var type;

test("empty map", function (t) {
  type = new MapType(new proto.StringType);
  t.deepEqual(type.marshal({}), {}, 'marshals');
  t.end();
});

test("string map", function (t) {
  type = new MapType(new proto.StringType);
  t.deepEqual(type.marshal({a: ''}), {a: ''}, 'marshals');
  t.end();
});

test("string map with number", function (t) {
  type = new MapType(new proto.StringType);
  t.throws(function () {
    type.marshal({a: 1})
  })
  t.end();
});

test("medium sized string map", function (t) {
  type = new MapType(new proto.StringType);
  var x = {a: 'a', b: 'b', c: 'c'};
  t.deepEqual(type.marshal(x), x);
  t.end();
});
