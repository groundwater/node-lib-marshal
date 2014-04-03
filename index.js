/* jshint latedef: false */
module.exports = {
  NumberType : NumberType,
  StringType : StringType,
  ArrayType  : ArrayType,
  MapType    : MapType,
  StructType : StructType,
};

function NumberType(opts) {
  this.opts = opts;
}

NumberType.prototype.marshal = function (val) {
  if (typeof val !== 'number')
   throw new Error('Expected a Number ' + JSON.stringify(val));

  return val;
};

function StringType(opts) {
  this.opts = opts;
}

StringType.prototype.marshal = function (val) {
  if (typeof val !== 'string')
    throw new Error('Expected a String ' + JSON.stringify(val));

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

function StructType(opts) {
  this.required = {};
  this.optional = {};
  this.strict   = opts ? !!opts.strict : false;
}

StructType.prototype.addRequired = function (key, type) {
  this.required[key] = type;

  return this;
};

StructType.prototype.addOptional = function (key, type) {
  this.optional[key] = type;

  return this;
};

StructType.prototype.marshal = function (val) {
  if (typeof val !== 'object') throw new Error('expected struct object');
  if (val === null)            throw new Error('struct cannot be null');
  if (Array.isArray(val))      throw new Error('struct cannot be an array');

  var isStrict = this.strict;

  var out = {};
  Object.keys(this.required).forEach(function (key) {
    out[key] = this.required[key].marshal(val[key]);
  }, this);

  Object.keys(this.optional).forEach(function (key) {
    if (val[key] === undefined) return;

    out[key] = this.optional[key].marshal(val[key]);
  }, this);

  if(isStrict) {
    if (Object.keys(out).length !== Object.keys(val).length)
      throw new Error('strict mode does not allow extra properties');
  }

  return out;
};
