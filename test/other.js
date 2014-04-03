function NumberType(opts) {
  this.opts = opts;
}

NumberType.prototype.parse = function (val) {
  if (typeof val !== 'number') throw new Error();

  return val;
};

function StringType(opts) {
  this.opts = opts;
}

StringType.prototype.parse = function (val) {
  if (typeof val !== 'string') throw new Error();

  return val;
};

function ArrayType(type) {
  this.type = type;
}

ArrayType.prototype.parse = function (val) {
  if (! Array.isArray(val)) throw new Error();

  var type = this.type;
  var out = [];

  val.forEach(function (item) {
    out.push(type.parse(item));
  });

  return out;
};

function MapType(type) {
  this.type = type;
}

MapType.prototype.parse = function (val) {
  var type  = this.type;

  if (typeof val !== 'object') throw new Error();

  var out = {};
  Object.keys(val).forEach(function (key) {
    out[key] = type.parse(val[key]);
  });

  return out;
};

function ClassType(type) {
  this.type = type;
  this.types = {};
  this.optn = {};
}

ClassType.prototype.addRequired = function (key, type) {
  this.types[key] = type;

  return this;
};

ClassType.prototype.addOptional = function (key, type) {
  this.optn[key] = type;

  return this;
}

ClassType.prototype.parse = function (val) {
  if (!(val instanceof this.type)) throw new Error();

  var out = {};
  Object.keys(this.types).forEach(function (key) {
    out[key] = this.types[key].parse(val[key]);
  }, this);

  Object.keys(this.optn).forEach(function (key) {
    if (val[key] === undefined) return;

    out[key] = this.optn[key].parse(val[key]);
  }, this);

  return out;
};

//-----
var assert = require('assert');
var type;

type = new NumberType();
assert.equal(type.parse(234), 234);
assert.throws(function () {
  type.parse('asdf');
});
assert.throws(function () {
  type.parse()
});

type = new StringType();
assert.equal(type.parse('hello'), 'hello')
assert.throws(function () {
  type.parse()
});

type = new ArrayType(type);
type.parse(['hello'])
assert.throws(function () {
  type.parse([123])
})

type = new MapType(new NumberType);
assert.deepEqual(type.parse({'hi': 123}), {'hi':123});
assert.throws(function () {
  type.parse({'hi': 'asdf'})
})

function Man(m){
  this.name = m
}

type = new ClassType(Man);
type.addRequired('name', new StringType)
assert.deepEqual(type.parse(new Man('hi')), {'name': 'hi'})
assert.throws(function () {
  type.parse(new Man())
})
type.addOptional('age', new StringType)
var m = new Man('hi')
assert.deepEqual(type.parse(m), {name: 'hi'})
m.age = 'asdf'
assert.deepEqual(type.parse(m), {name: 'hi', age: 'asdf'})

type = new MapType(new ClassType(Man).addRequired('name', new StringType))
console.log(
  type.parse({'as': new Man('hi')})
)

console.log('ok')
