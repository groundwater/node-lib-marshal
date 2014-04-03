var proto = require('../index.js');
var test = require('tap').test;

var StructType = proto.StructType;

//-----
var type;

test("type generation", function (t) {
  function A() {}
  var a = new StructType(A);

  t.ok(a.marshal(new A) instanceof A);
  t.ok(a.marshal({}) instanceof A);
  t.end();
});

test("type generation accepts other types", function (t) {
  function A() {}
  function B() {}
  var a = new StructType(A);

  t.ok(a.marshal(new B) instanceof A);
  t.end();
});

test("error to create non-function struct", function (t) {
  t.throws(function(){
    new StructType({});
  })

  t.end();
});

test("comprehensive", function (t) {
  var car = new StructType;
  var man = new StructType;

  man.addRequired('name', new proto.StringType);
  man.addOptional('age', new proto.NumberType);

  car.addRequired('type', new proto.StringType);
  car.addRequired('miles', new proto.NumberType);
  car.addRequired('driver', man);
  car.addOptional('passengers', new proto.ArrayType(man));

  t.throws(function(){
    car.marshal({})
  })

  var x = {
    type: 'mazda',
    miles: 10000,
    driver: {
      name: 'bob',
      age: 30
    },
    passengers: [
      {
        // missing name
      },
      {
        name: 'joe',
        age: 12
      }
    ]
  };

  // struct is missing one deep piece
  t.throws(function(){
    car.marshal(x)
  })

  // fix struct
  x.passengers[0].name = 'joe';

  // should work now
  t.deepEqual(car.marshal(x), x);

  t.end();
});

test("required string", function (t) {
  type = new StructType;
  type.addRequired('a', new proto.StringType);
  t.deepEqual(type.marshal({a: ''}), {a: ''}, 'marshals');
  t.end();
});

test("required string missing", function (t) {
  type = new StructType;
  type.addRequired('a', new proto.StringType);
  t.throws(function(){
    type.marshal({})
  })
  t.end();
});

test("optional string", function (t) {
  type = new StructType;
  type.addOptional('a', new proto.StringType);
  t.deepEqual(type.marshal({a: ''}), {a: ''}, 'marshals');
  t.end();
});

test("optional string missing", function (t) {
  type = new StructType;
  type.addOptional('a', new proto.StringType);
  t.deepEqual(type.marshal({}), {}, 'marshals');
  t.end();
});

test("omit undeclared property", function (t) {
  type = new StructType;
  t.deepEqual(type.marshal({a: 'hi'}), {}, 'marshals');
  t.end();
});

test("null", function (t) {
  type = new StructType;
  t.throws(function(){
    type.marshal(null)
  })
  t.end();
});

test("undefined", function (t) {
  type = new StructType;
  t.throws(function(){
    type.marshal()
  })
  t.end();
});

test("number", function (t) {
  type = new StructType;
  t.throws(function(){
    type.marshal(1)
  })
  t.end();
});

test("string", function (t) {
  type = new StructType;
  t.throws(function(){
    type.marshal('hello')
  })
  t.end();
});

test("array", function (t) {
  type = new StructType;
  t.throws(function(){
    type.marshal([])
  })
  t.end();
});
