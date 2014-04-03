# lib-stream-protocol

> create and parse object streams from a single definition

[![Build Status](https://travis-ci.org/groundwater/node-lib-stream-protocol.svg?branch=master)](https://travis-ci.org/groundwater/node-lib-stream-protocol)

## Install

```bash
npm install --save lib-stream-protocol
```

## Usage

### define your types

```javascript
var proto = require('lib-stream-protocol');

// create your data type
function Message() {
  this.from    = '';
  this.dest    = '';
  this.body    = '';
  this.subject = '';
  this._some_internal_property = null;
}

// define some types
var stringProto  = new proto.StringType;
var messageProto = new proto.StructType(Message);

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
