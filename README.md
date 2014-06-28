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

## errors

Handy dandy error messages

```js
var message = new StructType;
var address = new StructType;
var content = new StructType;

content.add('subject', new StringType)
content.add('body', new StringType)
content.add('author', address)

address.add('name', new StringType)
address.add('email', new StringType)

message.add('from', address)
message.add('to', address)
message.add('content', content)

message.marshal({
  to: {
    name    : "Kim",
    email   : "kim@outer.space"
  },
  from      : {
    name    : "Bob",
    email   : "bob@outer.space"
  },
  content   : {
    body    : "This is a test",
    subject : "Hello World",
    author  : "Bob"
  }
});
```

You'll receive a helpful error when things fail to parse

```
Error: Expected <object> but Received <Bob> of type <string> at <object>.content.author
```

## see also

- [lib-schema](https://www.npmjs.org/package/lib-schema)
  generate a marshaller from a json schema
