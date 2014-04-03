var proto = require('../index.js');
var test = require('tap').test;

var NumberType = proto.NumberType;
var StringType = proto.StringType;
var MapType    = proto.MapType;
var ClassType  = proto.ClassType;
var ArrayType  = proto.ArrayType;

//-----
var type;

test(function (t) {
  type = new NumberType();
  t.equal(type.parse(234), 234);
  t.throws(function () {
    type.parse('asdf');
  });
  t.throws(function () {
    type.parse()
  });
  t.end();
})

test(function (t) {
  type = new StringType();
  t.equal(type.parse('hello'), 'hello')
  t.throws(function () {
    type.parse()
  });
  t.end();
})

test(function (t) {
  type = new ArrayType(type);
  type.parse(['hello'])
  t.throws(function () {
    type.parse([123])
  });
  t.end();
})

test(function (t) {
  type = new MapType(new NumberType);
  t.deepEqual(type.parse({'hi': 123}), {'hi':123});
  t.throws(function () {
    type.parse({'hi': 'asdf'})
  });
  t.end();
})

function Man(m){
  this.name = m
}

test(function (t) {
  type = new ClassType(Man);
  type.addRequired('name', new StringType)
  t.deepEqual(type.parse(new Man('hi')), {'name': 'hi'})
  t.throws(function () {
    type.parse(new Man())
  })
  type.addOptional('age', new StringType)
  var m = new Man('hi')
  t.deepEqual(type.parse(m), {name: 'hi'})
  m.age = 'asdf'
  t.deepEqual(type.parse(m), {name: 'hi', age: 'asdf'})
  t.end();
});

test(function (t) {
  type = new MapType(new ClassType(Man).addRequired('name', new StringType))
  t.deepEqual(
    type.parse({'as': new Man('hi')}),
    {as: {name: 'hi'}}
  );
  t.end();
});
