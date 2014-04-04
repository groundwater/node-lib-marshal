# lib-marshal

> marshalled object validation

[![Build Status](https://travis-ci.org/groundwater/node-lib-marshal.svg?branch=master)](https://travis-ci.org/groundwater/node-lib-marshal)

## Install

```bash
npm install --save lib-marshal
```

## Usage

### define your types

```javascript
var marshal = require('lib-marshal');

// define some types
var stringProto  = new marshal.StringType;
var messageProto = new marshal.StructType;

messageProto.add('from'   , stringProto);
messageProto.add('dest'   , stringProto);
messageProto.add('body'   , stringProto);
messageProto.add('subject', stringProto);
```

### prepare data for the client

Prepare data for the client,
by stripping out unused properties and validating data types.

```javascript
// create a data object
var m = {
  from: 'bob',
  dest: 'kim',
  body: 'hello world'
};

// ready it for the world, or die trying
JSON.stringify(messageProto.marshal(m))
```

### parse incoming data

Validate an incoming object, or throw an error.

```javascript
var message = messageProto.marshal(JSON.parse(str))
```

## see also

- [lib-schema](https://www.npmjs.org/package/lib-schema)
  generate a marshaller from a json schema
