function Type() {
  this._simple = {};
  this._maps   = {};
  this._lists  = {};
  this._class  = {};
}

Type.prototype.addSimple = function (name, type) {
  this._simple[name] = type;
};

Type.prototype.addMap = function (name, type) {
  this._maps[name] = type;
};

Type.prototype.addList = function (name, type) {
  this._lists[name] = type;
};

Type.prototype.addClass = function (name, type) {
  this._class[name] = type;
};

Type.prototype.stringify = function (ob) {
  var x = {};

  Object.keys(this._simple).forEach(function (key) {
    var check = this._simple[key];
    var val   = ob[key];
    check(val);
    x[key] = ob[key];
  }, this);

  Object.keys(this._lists).forEach(function (key) {
    var check = this._simple[key];
    var val   = ob[key];

    x[key] = ob[key];
  }, this);

  return JSON.stringify(x);
};

var type = {
  string: function (x) {
    if (typeof x !== 'string') throw new Error();
  },
  number: function (x) {
    if (typeof x !== 'number') throw new Error();
  },
  object: function () {

  },
  array : function () {

  },
}

// -------------

var assert = require('assert');

function Person() {
  this.kinds = {};
  this.name  = '';
  this.age   = 0;
}

var personType = new Type();

personType.addSimple ('name'    , type.string);
personType.addSimple ('age'     , type.number);
personType.addMap    ('keys'    , type.string);
personType.addList   ('types'   , type.string);
personType.addClass  ('children', Person);

var p = new Person();
p.name = 'bob';
p.age = 10;
p.kind = 'asdf';

var x = JSON.parse(personType.stringify(p))

assert.equal(x.name, 'bob');
assert.equal(x.age, 10);
assert.equal(x.kind, undefined);
assert.throws(function () {
  p.name = 123;
  personType.stringify(p);
});
p.name = 'bob';

assert.throws(function () {
  p.age = '123';
  personType.stringify(p);
});
p.age = 123;

p.types = ['one'];
x = JSON.parse(personType.stringify(p));
assert.deepEqual(x.types, p.types);
