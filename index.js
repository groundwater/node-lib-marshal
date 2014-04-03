var util = require('util');

/* jshint latedef: false */
module.exports = {
  NumberType : NumberType,
  StringType : StringType,
  ArrayType  : ArrayType,
  MapType    : MapType,
  ClassType  : ClassType,
};

function NumberType(opts) {
  this.opts = opts;
}

NumberType.prototype.parse = function (val) {
  if (typeof val !== 'number')
   throw new Error('Expected a Number ' + JSON.stringify(val));

  return val;
};

function StringType(opts) {
  this.opts = opts;
}

StringType.prototype.parse = function (val) {
  if (typeof val !== 'string')
    throw new Error('Expected a String ' + JSON.stringify(val));

  return val;
};

function ArrayType(type) {
  this.type = type;
}

ArrayType.prototype.parse = function (val) {
  if (! Array.isArray(val))
    throw new Error('Expected Array ' + JSON.stringify(val));

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
};

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
