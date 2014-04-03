var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;

//-----
var type;

test("number min", function (t) {
  type = new NumberType({
    min: 0
  });
  t.equal(type.marshal(0), 0, 'marshals');
  t.throws(function(){
    type.marshal(-1);
  });
  t.end();
});

test("number max", function (t) {
  type = new NumberType({
    max: 0
  });
  t.equal(type.marshal(0), 0, 'marshals');
  t.throws(function(){
    type.marshal(1);
  });
  t.end();
});

test("min and max", function (t) {
  type = new NumberType({
    max: 1,
    min: 0,
  });
  t.equal(type.marshal(0.4), 0.4, 'marshals');
  t.throws(function(){
    type.marshal(1.4);
  });
  t.end();
});
