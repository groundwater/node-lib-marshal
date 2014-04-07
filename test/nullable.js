var proto = require('../index.js');
var test = require('tap').test;

test("nullable type allows null value", function (t) {
  var strc = new proto.StructType();
  var type = new proto.Nullable(strc);

  t.strictEquals(type.marshal(null), null)

  t.end();
})

test("nullable type delegates non-null value", function (t) {
  var strc = new proto.NumberType();
  var type = new proto.Nullable(strc);

  t.strictEquals(type.marshal(12), 12)

  t.end();
})

test("nullable type requires .marshal function on type argument", function (t) {
  t.throws(function (){
    new proto.Nullable({});
  })
  t.ok(new proto.Nullable({marshal:function(){}}));
  t.end();
})
