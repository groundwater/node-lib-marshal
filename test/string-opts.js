var proto = require('../index.js');
var test = require('tap').test;

var StringType = proto.StringType;

//-----
var type;

test("min string", function (t) {
  type = new StringType({
    min: 2
  });
  t.throws(function(){
    type.marshal('a');
  }, new Error('Value <a> must be at least 2 characters at <object>'));
  t.equal(type.marshal('aa') ,'aa')
  t.end();
});

test("max string", function (t) {
  type = new StringType({
    max: 1
  });
  t.throws(function(){
    type.marshal('aaa');
  }, new Error('Value <aaa> must be at most 1 characters at <object>'));
  t.equal(type.marshal(' ') ,' ')
  t.end();
});

test("match string", function(t) {
  type = new StringType({
    match: /d+/
  });
  t.throws(function(){
    type.marshal('abc');
  }, new Error('Value <abc> must be match the pattern </d+/> at <object>'));
  t.equal(type.marshal('ddd') ,'ddd')
  t.end();
});

test("callback string", function(t) {
  type = new StringType({
    valid: function isHi(x){
      return (x === 'hi');
    }
  });
  t.throws(function(){
    type.marshal('bye');
  }, new Error('Value <bye> must be pass validation function <isHi> at <object>'));
  t.equal(type.marshal('hi') ,'hi')
  t.end();
});

test("example match", function(t){
  var str = new StringType({min: 1, max: 20, match: /.@.\../})

  t.throws(function(){
    str.marshal('bob AT aol.com')
  }, new Error('Value <bob AT aol.com> must be match the pattern </.@.\\../> at <object>'))
  t.end()
})
