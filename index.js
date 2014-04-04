'use strict';

var assert = require('assert');

/* jshint latedef: false */
module.exports = {
  NumberType : NumberType,
  StringType : StringType,
  ArrayType  : ArrayType,
  MapType    : MapType,
  StructType : StructType,
};

function NumberType(opts) {
  this.opts = opts || {};
}

NumberType.prototype.marshal = function (val) {
  if (typeof val !== 'number')
   throw new Error('Expected a Number ' + JSON.stringify(val));

  var opts = this.opts;
  if (opts.min !== undefined) assert(opts.min <= val);
  if (opts.max !== undefined) assert(opts.max >= val);

  return val;
};

function StringType(opts) {
  this.opts = opts || {};
}

StringType.prototype.marshal = function (val) {
  if (typeof val !== 'string')
    throw new Error('Expected a String ' + JSON.stringify(val));

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

ArrayType.prototype.marshal = function (val) {
  if (! Array.isArray(val))
    throw new Error('Expected Array ' + JSON.stringify(val));

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

MapType.prototype.marshal = function (val) {
  var type  = this.type;

  if (typeof val !== 'object') throw new Error();

  var out = {};
  Object.keys(val).forEach(function (key) {
    out[key] = type.marshal(val[key]);
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

StructType.prototype.marshal = function (val, stack) {
  if (typeof val !== 'object') throw new Error('expected struct object');
  if (val === null)            throw new Error('struct cannot be null');
  if (Array.isArray(val))      throw new Error('struct cannot be an array');

  // cannot marshal recursive objects
  if (!stack) stack = [];
  if (stack.indexOf(val) > -1) throw new Error('Cyclic Error');
  stack.push(val);

  var isStrict = this.strict;

  var out = new this.type();
  Object.keys(this.required).forEach(function (key) {
    out[key] = this.required[key].marshal(val[key], stack);
  }, this);

  Object.keys(this.optional).forEach(function (key) {
    if (val[key] === undefined) return;

    out[key] = this.optional[key].marshal(val[key], stack);
  }, this);

  if(isStrict) {
    if (Object.keys(out).length !== Object.keys(val).length)
      throw new Error('strict mode does not allow extra properties');
  }

  return out;
};
