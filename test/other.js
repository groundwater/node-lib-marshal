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
  t.equal(type.ratify(234), 234);
  t.throws(function () {
    type.ratify('asdf');
  });
  t.throws(function () {
    type.ratify()
  });
  t.end();
})

test(function (t) {
  type = new StringType();
  t.equal(type.ratify('hello'), 'hello')
  t.throws(function () {
    type.ratify()
  });
  t.end();
})

test(function (t) {
  type = new ArrayType(type);
  type.ratify(['hello'])
  t.throws(function () {
    type.ratify([123])
  });
  t.end();
})

test(function (t) {
  type = new MapType(new NumberType);
  t.deepEqual(type.ratify({'hi': 123}), {'hi':123});
  t.throws(function () {
    type.ratify({'hi': 'asdf'})
  });
  t.end();
})

function Man(m){
  this.name = m
}

test(function (t) {
  type = new ClassType(Man);
  type.addRequired('name', new StringType)
  t.deepEqual(type.ratify(new Man('hi')), {'name': 'hi'})
  t.throws(function () {
    type.ratify(new Man())
  })
  type.addOptional('age', new StringType)
  var m = new Man('hi')
  t.deepEqual(type.ratify(m), {name: 'hi'})
  m.age = 'asdf'
  t.deepEqual(type.ratify(m), {name: 'hi', age: 'asdf'})
  t.end();
});

test(function (t) {
  type = new MapType(new ClassType(Man).addRequired('name', new StringType))
  t.deepEqual(
    type.ratify({'as': new Man('hi')}),
    {as: {name: 'hi'}}
  );
  t.end();
});
