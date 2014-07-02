'use strict';

var fmt    = require('util').format;
var assert = require('assert');

/* jshint latedef: false */
module.exports = {
  NumberType : NumberType,
  StringType : StringType,
  ArrayType  : ArrayType,
  MapType    : MapType,
  StructType : StructType,
  Nullable   : Nullable
};

function TypeOf(val){
  var type
  if (Array.isArray(val))
    type = 'array'
  else type = typeof val

  return type
}

function MarshalError(expected, received, path) {
  try {
    var rec = JSON.stringify(received)
  }catch(e){
    var rec = "???"
  }
  var message = fmt("Expected <%s> but Received %s of type <%s> at %s",
    expected,
    rec,
    TypeOf(received),
    ['<var>'].concat(path).join('.')
  );
  var error   = new Error(message);

  error.path     = path;
  error.expected = expected;
  error.recieved = received;

  return error;
}

function RequiredError(key, path) {
  var message = fmt("Required Property <%s> Missing at %s",
    key,
    ['<var>'].concat(path).join('.')
  );
  var error   = new Error(message);

  error.key   = key;
  error.path  = path;

  return error;
}

function ConstraintError(received, constraint, path) {
  var message = fmt("Value <%s> must be %s at %s",
    received,
    constraint,
    ['<var>'].concat(path).join('.')
  );
  var error   = new Error(message);

  error.path       = path;
  error.received   = received;
  error.constraint = constraint;

  return error;
}

function Nullable(type) {
  assert.equal(typeof type.marshal, 'function', 'Type Requires .marshal Method');
  this.type = type;
}

Nullable.prototype.marshal = function (val, _, path) {
  path = path || [];

  if (val === null) return null;
  else return this.type.marshal(val, _, path);
};

function NumberType(opts) {
  this.opts = opts || {};
}

NumberType.prototype.marshal = function (val, _, path) {
  path = path || [];

  if (typeof val !== 'number')
   throw MarshalError('number', val, path);

  var opts = this.opts;

  // check minimum constraint
  if (opts.min !== undefined && opts.min > val)
    throw ConstraintError(val, 'greater than ' + opts.min, path);

  // check maximum constraint
  if (opts.max !== undefined && opts.max < val)
    throw ConstraintError(val, 'less than ' + opts.max, path);

  return val;
};

function StringType(opts) {
  this.opts = opts || {};
}

StringType.prototype.marshal = function (val, _, path) {
  path = path || [];

  if (typeof val !== 'string')
    throw MarshalError('String', val, path);

  var opts = this.opts;

  if (opts.min && val.length < opts.min)
    throw ConstraintError(val, 'at least ' + opts.min + ' characters', path);

  if (opts.max && val.length > this.opts.max)
    throw ConstraintError(val, 'at most ' + opts.max + ' characters', path);

  if (opts.match && !val.match(opts.match))
    throw ConstraintError(val, 'match the pattern <' + opts.match + '>', path);

  if (opts.valid && !opts.valid(val))
    throw ConstraintError(val, 'pass validation function <' + (opts.valid.name || 'anonymous') + '>', path);

  return val;
};

function ArrayType(type) {
  this.type = type;
}

ArrayType.prototype.marshal = function (val, _, path) {
  path = path || [];

  if (! Array.isArray(val))
    throw MarshalError('Array', val, path);

  var type = this.type;
  var out = [];

  var i = 0
  val.forEach(function (item) {
    out.push(type.marshal(item, _, path.concat('['+ i++ +']')));
  });

  return out;
};

function MapType(type) {
  this.type = type;
}

MapType.prototype.marshal = function (val, _, path) {
  path = path || [];

  var type  = this.type;

  if (typeof val !== 'object') throw MarshalError('Map', val, path);

  var out = {};
  Object.keys(val).forEach(function (key) {
    out[key] = type.marshal(val[key], _, path.concat(key));
  });

  return out;
};

function StructType(type, opts) {
  this.type     = type || Object;

  if (typeof this.type !== 'function')
    throw new Error('must pass a function type or none');

  this.required = {};
  this.optional = {};
  this.strict   = opts ? !!opts.strict : false;
}

StructType.prototype.addRequired = function (key, type) {
  this.required[key] = type;

  return this;
};

StructType.prototype.add = function (key, type) {
  this.optional[key] = type;

  return this;
};

StructType.prototype.marshal = function (val, stack, path) {
  path = path || [];

  if (typeof val !== 'object') throw MarshalError('object', val, path);
  if (val === null)            throw MarshalError('object', val, path);
  if (Array.isArray(val))      throw MarshalError('object', val, path);

  // cannot marshal recursive objects
  if (!stack) stack = [];
  if (stack.indexOf(val) > -1) throw new Error('Cyclic Error', path);
  stack.push(val);

  var isStrict = this.strict;

  var out = new this.type();
  Object.keys(this.required).forEach(function (key) {
    if (val[key] === undefined) throw RequiredError(key, path);

    out[key] = this.required[key].marshal(val[key], stack, path.concat(key));
  }, this);

  Object.keys(this.optional).forEach(function (key) {
    if (val[key] === undefined) return;

    out[key] = this.optional[key].marshal(val[key], stack, path.concat(key));
  }, this);

  if(isStrict) {
    if (Object.keys(out).length !== Object.keys(val).length)
      throw new Error('strict mode does not allow extra properties');
  }

  return out;
};
