var proto = require('../index.js');
var test = require('tap').test;

var StructType = proto.StructType;

//-----
var type;

test("strict mode", function (t) {
  var type = new StructType({strict: true});

  type.addRequired('a', new proto.StringType);

  t.deepEqual(type.marshal({a: 'one'}), {a: 'one'});

  t.throws(function(){
    type.marshal({a: 'one', b: 'bee'});
  })

  t.end();
});
