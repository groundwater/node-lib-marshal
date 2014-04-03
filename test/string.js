var proto = require('../index.js');
var test = require('tap').test;

var StringType = proto.StringType;

//-----
var type;

test("empty string", function (t) {
  type = new StringType();
  t.equal(type.marshal(''), '', 'marshals');
  t.end();
});

test("undefined", function (t) {
  type = new StringType();
  t.throws(function () {
    type.marshal()
  });
  t.end();
});

test("null", function (t) {
  type = new StringType();
  t.throws(function () {
    type.marshal(null)
  });
  t.end();
});

test("basic string", function (t) {
  type = new StringType();
  t.equals(type.marshal('hello'), 'hello')
  t.end();
});
