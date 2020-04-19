# response-body-builder
Response Builder is a middleware that helps build you response bodys for APIs.

# Installation
```
npm install response-body-builder
```

# Usage
**Basic Usage**
```js
const { ResponseBuilder, ResponseBuilderMiddleware } = require("response-body-builder");
const express = require("express");
const app = express();

app.use(ResponseBuilderMiddleware);

app.get("/ping", (req, res) => {
  const response = new ResponseBuilder()
    .set("ping", "Pong!");
  res.sendResponse(response);
  // {
  //   "ping": "Pong!",
  //   "httpCode": 200,
  //   "httpCodeMessage": "Successful."
  // }
});
```
**Advanced Usage Example**
```js
const { ResponseBuilder } = require("response-body-builder");
const wait = require("util").promisify(setTimeout);

(async function () {
  const response = await (
    new ResponseBuilder()
      .set("test", "hello")
      .setPromise("bool", fakePromiseValue(500))
      .mergePromise(fakePromiseObject(200))
      .setCode(500)
      .cast()
  );

  const syncResponse = new ResponseBuilder()
    .set("test", "hello")
    .setPromise("bool", fakePromiseValue(500))
    .mergePromise(fakePromiseObject(200))
    .setCode(500)
    .castSync();

  console.log(response);
  console.log(syncResponse); // Ignore everything promise-related.
  
  // Output:
  // {
  //   test: 'hello',
  //   httpCode: 500,
  //   httpCodeMessage: 'Internal server error.',
  //   bool: false,
  //   two: 2,
  //   four: 4
  // }
  // {
  //   test: 'hello',
  //   httpCode: 500,
  //   httpCodeMessage: 'Internal server error.'
  // }
}());

async function fakePromiseValue (time) {
  await wait(time);
  return (Math.random() * 100 < 50 ? true : false);
}

async function fakePromiseObject (time) {
  await wait(time);
  return {
    two: 2,
    four: 4
  }
}
```

# Documentation
1) `.set(key, value)` (Returns `this`)

Adds key-value pair to the body object.

2) `.setAsync(key, promise)` (Returns `this`)

Starts to resolve the promise right away ,without adding it to queue, once done, it adds it to the body object as a key-value pair.

**If promise doesn't resolve until `.cast()` or `.castSync()` are called, the result of the promise will not be included into the body object, not recommended to use.** 

3) `.mergePromise(promise)` (Returns `this`)

Queues the promise into the mergePromises queue. (Upon `.cast()` all the promises queued are resolved and their value properties are merged into the body object.)

4) `.setPromise(key, promise)` (Returns `this`)

Queues the promise into the keyPromises queue. (Upon `.cast()` all promises queued are resolved and added to the body object as a key-resovled value pair.)

5) `.merge(object)` (Returns `this`)

Copies all of the properties of `object` into the body object.

6) `.cast([useCode] = true)` (Returns `Promise<Object>`)

*`useCode` whether or not the status code and the message relevant to it to be inserted into the body object.*

Resolves all of the promise queues into the body object and returns it.

7) `.castSync([useCode = true])` (Return `Object`)

*`useCode` whether or not the status code and the message relevant to it to be inserted into the body object.*

Returns the body object, skipping to resolve any of the queues.

8) `.setCode(httpCode[, message])`

Sets the status code of the request. If `message` is not provided, the default message for the will be used for supported codes (or undefined for non-supported status codes).

9) `Supported Http Code Messages`
```
"HTTP_200": "Successful.",
"HTTP_204": "No content.",
"HTTP_400": "Bad request.",
"HTTP_401": "Unauthorized.",
"HTTP_403": "Forbidden.",
"HTTP_404": "Not found",
"HTTP_429": "Too many requests.",
"HTTP_500": "Internal server error.",
"HTTP_503": "Service unavailable."
```
