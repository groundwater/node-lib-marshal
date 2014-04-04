var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;
var StringType = proto.StringType;
var MapType    = proto.MapType;
var StructType = proto.StructType;
var ArrayType  = proto.ArrayType;

//-----
var type;

test(function (t) {
  type = new NumberType();
  t.equal(type.marshal(234), 234);
  t.throws(function () {
    type.marshal('asdf');
  });
  t.throws(function () {
    type.marshal()
  });
  t.end();
})

test(function (t) {
  type = new StringType();
  t.equal(type.marshal('hello'), 'hello')
  t.throws(function () {
    type.marshal()
  });
  t.end();
})

test(function (t) {
  type = new ArrayType(type);
  type.marshal(['hello'])
  t.throws(function () {
    type.marshal([123])
  });
  t.end();
})

test(function (t) {
  type = new MapType(new NumberType);
  t.deepEqual(type.marshal({'hi': 123}), {'hi':123});
  t.throws(function () {
    type.marshal({'hi': 'asdf'})
  });
  t.end();
})

function Man(m){
  this.name = m
}

test(function (t) {
  type = new StructType(Man);
  type.addRequired('name', new StringType)
  t.deepEqual(type.marshal(new Man('hi')), {'name': 'hi'})
  t.throws(function () {
    type.marshal(new Man())
  })
  type.add('age', new StringType)
  var m = new Man('hi')
  t.deepEqual(type.marshal(m), {name: 'hi'})
  m.age = 'asdf'
  t.deepEqual(type.marshal(m), {name: 'hi', age: 'asdf'})
  t.end();
});

test(function (t) {
  type = new MapType(new StructType(Man).addRequired('name', new StringType))
  t.deepEqual(
    type.marshal({'as': new Man('hi')}),
    {as: {name: 'hi'}}
  );
  t.end();
});
