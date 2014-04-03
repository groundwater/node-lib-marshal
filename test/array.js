var proto = require('../index.js');
var test = require('tap').test;

var ArrayType = proto.ArrayType;

//-----
var type;

test("empty array", function (t) {
  type = new ArrayType(new proto.StringType);
  t.deepEqual(type.marshal([]), [], 'marshals');
  t.end();
});

test("null", function (t) {
  type = new ArrayType(new proto.StringType);
  t.throws(function () {
    type.marshal(null)
  })
  t.end();
});

test("undefined", function (t) {
  type = new ArrayType(new proto.StringType);
  t.throws(function () {
    type.marshal()
  })
  t.end();
});

test("wrong array type", function (t) {
  type = new ArrayType(new proto.StringType);
  t.throws(function () {
    type.marshal([1])
  })
  t.end();
});

test("string array type", function (t) {
  type = new ArrayType(new proto.StringType);
  t.deepEqual(type.marshal(['one', 'two']), ['one', 'two'])
  t.end();
});

test("mixed array type", function (t) {
  type = new ArrayType(new proto.StringType);
  t.throws(function () {
    type.marshal([1, 'two'])
  })
  t.end();
});

test("mixed array type with nulls", function (t) {
  type = new ArrayType(new proto.StringType);
  t.throws(function () {
    type.marshal(['asdf', null])
  })
  t.end();
});
