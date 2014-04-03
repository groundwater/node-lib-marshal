# lib-stream-protocol

> create and parse object streams from a single definition

## Install

```bash
npm install --save lib-stream-protocol
```

## Usage

```javascript
var proto = require('lib-stream-protocol');

// create your data type
function Message() {
  this.from    = '';
  this.dest    = '';
  this.body    = '';
  this.subject = '';
}

// define some types
var stringProto  = new proto.StringType;
var messageProto = new proto.ClassType(Message);
messageProto.addRequired('from', stringProto);
messageProto.addRequired('dest', stringProto);
messageProto.addOptional('body', stringProto);
messageProto.addOptional('subject', stringProto);

// create a data object
var m = new Message();
m.from = 'bob';
m.dest = 'kim';
m.body = 'hello world';

// stream it to the world!
messageProto.stream(m).pipe(http.request(opts, response));
```
