var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;
var StringType = proto.StringType;
var MapType    = proto.MapType;
var ClassType  = proto.ClassType;
var ArrayType  = proto.ArrayType;

//-----
var type;

test("number type pasring a string", function (t) {
  type = new NumberType();
  t.throws(function () {
    type.marshal('asdf');
  }, new Error('Expected a Number "asdf"'), 'throws exception');
  t.end();
});

test("string type pasring a number", function (t) {
  type = new StringType();
  t.throws(function () {
    type.marshal(1234);
  }, new Error('Expected a String 1234'), 'throws exception');
  t.end();
});

test("array[string] type pasring a string", function (t) {
  type = new ArrayType(new StringType);
  t.throws(function () {
    type.marshal('hello');
  }, new Error('Expected Array "hello"'), 'throws exception');
  t.end();
});
