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

// create your data type
function Message() {
  this.from    = '';
  this.dest    = '';
  this.body    = '';
  this.subject = '';
  this._some_internal_property = null;
}

// define some types
var stringProto  = new marshal.StringType;
var messageProto = new marshal.StructType(Message);

messageProto.addRequired('from'   , stringProto);
messageProto.addRequired('dest'   , stringProto);
messageProto.addOptional('body'   , stringProto);
messageProto.addOptional('subject', stringProto);
```

### prepare data for the client

```javascript
// create a data object
var m = new Message();
m.from = 'bob';
m.dest = 'kim';
m.body = 'hello world';

// ready it for the world
JSON.stringify(messageProto.marshal(m))
```

### parse incoming data

```javascript
// message will either be a correct Message object, or throw an error
var message = messageProto.marshal(JSON.parse(str))
```
