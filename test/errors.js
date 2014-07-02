var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;
var StringType = proto.StringType;
var MapType    = proto.MapType;
var StructType  = proto.StructType;
var ArrayType  = proto.ArrayType;

//-----
var type;

test("number type pasring a string", function (t) {
  type = new NumberType();
  t.throws(function () {
    type.marshal('asdf');
  }, new Error('Expected <number> but Received "asdf" of type <string> at <var>'), 'throws exception');
  t.end();
});

test("string type pasring a number", function (t) {
  type = new StringType();
  t.throws(function () {
    type.marshal(1234);
  }, new Error('Expected <String> but Received 1234 of type <number> at <var>'), 'throws exception');
  t.end();
});

test("array[string] type pasring a string", function (t) {
  type = new ArrayType(new StringType);
  t.throws(function () {
    type.marshal('hello');
  }, new Error('Expected <Array> but Received "hello" of type <string> at <var>'), 'throws exception');
  t.end();
});

test("errors should reveal paths", function (t) {
  type = new StructType;
  type.add('a', type);

  t.throws(function () {
    type.marshal({a: {a: { b: '', a: 223}}});
  }, new Error('Expected <object> but Received 223 of type <number> at <var>.a.a.a'), 'throws exception');
  t.end();
});

test("errors should reveal paths (test 2)", function (t) {
  var num = new NumberType;
  type = new StructType;
  type.add('n', num);
  type.add('self', type)

  t.throws(function () {
    type.marshal({self: {n: 123, self: "HELLO"}});
  }, new Error('Expected <object> but Received "HELLO" of type <string> at <var>.self.self'), 'throws exception');
  t.end();
});

test("errors should reveal paths (test 3)", function (t) {
  var message = new StructType;
  var address = new StructType;
  var content = new StructType;

  content.add('subject', new StringType)
  content.add('body', new StringType)
  content.add('author', address)

  address.add('name', new StringType)
  address.add('email', new StringType)

  message.add('from', address)
  message.add('to', address)
  message.add('content', content)

  t.throws(function () {
    message.marshal({
      to: {
        name    : "Kim",
        email   : "kim@outer.space"
      },
      from      : {
        name    : "Bob",
        email   : "bob@outer.space"
      },
      content   : {
        body    : "This is a test",
        subject : "Hello World",
        author  : "Bob"
      }
    });
  }, new Error('Expected <object> but Received "Bob" of type <string> at <var>.content.author'), 'throws exception');
  t.end();
});

test("errors path should traverse arrays properly", function (t) {
  type = new StructType;
  type.add('self', new ArrayType(type));

  t.throws(function () {
    type.marshal({self: [{self: []}, {}, 1]});
  }, new Error('Expected <object> but Received 1 of type <number> at <var>.self.[2]'),
    'throws exception');
  t.end();
});

test("arrays in errors should be identified as such", function (t) {
  type = new StructType;
  type.add('self', new ArrayType(type));

  t.throws(function () {
    type.marshal({self: [[]]});
  }, new Error('Expected <object> but Received [] of type <array> at <var>.self.[0]'),
    'throws exception');
  t.end();
});

test("circular object errors appear as ???", function (t) {
  type = new StructType;
  type.add('self', new ArrayType(type));

  var s = {}
  s.self = s

  t.throws(function () {
    type.marshal(s);
  }, new Error('Expected <Array> but Received ??? of type <object> at <var>.self'),
    'throws exception');
  t.end();
});
