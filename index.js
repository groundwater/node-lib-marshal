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

NumberType.prototype.ratify = function (val) {
  if (typeof val !== 'number')
   throw new Error('Expected a Number ' + JSON.stringify(val));

  return val;
};

function StringType(opts) {
  this.opts = opts;
}

StringType.prototype.ratify = function (val) {
  if (typeof val !== 'string')
    throw new Error('Expected a String ' + JSON.stringify(val));

  return val;
};

function ArrayType(type) {
  this.type = type;
}

ArrayType.prototype.ratify = function (val) {
  if (! Array.isArray(val))
    throw new Error('Expected Array ' + JSON.stringify(val));

  var type = this.type;
  var out = [];

  val.forEach(function (item) {
    out.push(type.ratify(item));
  });

  return out;
};

function MapType(type) {
  this.type = type;
}

MapType.prototype.ratify = function (val) {
  var type  = this.type;

  if (typeof val !== 'object') throw new Error();

  var out = {};
  Object.keys(val).forEach(function (key) {
    out[key] = type.ratify(val[key]);
  });

  return out;
};

function ClassType() {
  this.required = {};
  this.optional = {};
}

ClassType.prototype.addRequired = function (key, type) {
  this.required[key] = type;

  return this;
};

ClassType.prototype.addOptional = function (key, type) {
  this.optional[key] = type;

  return this;
};

ClassType.prototype.ratify = function (val) {
  var out = {};
  Object.keys(this.required).forEach(function (key) {
    out[key] = this.required[key].ratify(val[key]);
  }, this);

  Object.keys(this.optional).forEach(function (key) {
    if (val[key] === undefined) return;

    out[key] = this.optional[key].ratify(val[key]);
  }, this);

  return out;
};
