var proto = require('../index.js');
var test = require('tap').test;

var StructType = proto.StructType;

//-----
var type;

test("throw when detecting an object cycle", function (t) {
  function A() {
    this.a = A;
  }
  var a = new A();
  a.a = a;

  var aType = new StructType(A);
  aType.add('a', aType);

  t.throws(function () {
    aType.marshal(a)
  }, new Error('Cyclic Error'));

  t.end();
});
