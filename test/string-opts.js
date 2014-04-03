var proto = require('../index.js');
var test = require('tap').test;

var StringType = proto.StringType;

//-----
var type;

test("min string", function (t) {
  type = new StringType({
    min: 1
  });
  t.throws(function(){
    type.marshal('');
  });
  t.equal(type.marshal(' ') ,' ')
  t.end();
});

test("max string", function (t) {
  type = new StringType({
    max: 1
  });
  t.throws(function(){
    type.marshal('  ');
  });
  t.equal(type.marshal(' ') ,' ')
  t.end();
});

test("match string", function(t) {
  type = new StringType({
    match: /d+/
  });
  t.throws(function(){
    type.marshal('abc');
  });
  t.equal(type.marshal('ddd') ,'ddd')
  t.end();
});

test("callback string", function(t) {
  type = new StringType({
    valid: function (x){
      return (x === 'hi');
    }
  });
  t.throws(function(){
    type.marshal('bye');
  });
  t.equal(type.marshal('hi') ,'hi')
  t.end();
});
