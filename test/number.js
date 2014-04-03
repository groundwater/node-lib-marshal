var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;

//-----
var type;

test("number 0", function (t) {
  type = new NumberType();
  t.equal(type.marshal(0), 0, 'marshals');
  t.end();
});

test("number empty", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal()
  });
  t.end();
});

test("number null", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal(null)
  });
  t.end();
});

test("number string number", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal('1')
  });
  t.end();
});

test("number array number", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal([1])
  });
  t.end();
});

test("number false", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal(false)
  });
  t.end();
});

test("number true", function (t) {
  type = new NumberType();
  t.throws(function (){
    type.marshal(true)
  });
  t.end();
});
