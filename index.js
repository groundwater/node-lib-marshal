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

function MarshalError(expected, received, path) {
  var message = fmt("Expected <%s> but Received <%s> of type <%s> at %s",
    expected,
    received,
    typeof received,
    ['<object>'].concat(path).join('.')
  );
  var error   = new Error(message);

  error.path     = path;
  error.expected = expected;
  error.recieved = received;

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
  if (opts.min !== undefined) assert(opts.min <= val);
  if (opts.max !== undefined) assert(opts.max >= val);

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
  if (opts.min) assert(val.length >= this.opts.min);
  if (opts.max) assert(val.length <= this.opts.max);
  if (opts.match) assert(val.match(this.opts.match));
  if (opts.valid) assert(opts.valid(val));

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

  val.forEach(function (item) {
    out.push(type.marshal(item));
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
  if (val === null)            throw MarshalError('object', null, path);
  if (Array.isArray(val))      throw MarshalError('object', 'Array', path);

  // cannot marshal recursive objects
  if (!stack) stack = [];
  if (stack.indexOf(val) > -1) throw new Error('Cyclic Error', path);
  stack.push(val);

  var isStrict = this.strict;

  var out = new this.type();
  Object.keys(this.required).forEach(function (key) {
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
