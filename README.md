# response-builder
Response Builder is a middleware that helps build you response bodys for APIs.

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
1) `.set(key, value)`

Adds key-value pair to the body object.

2) `.setAsync(key, promise)`

Adds the key-value of the promise, resolves the promise asynchronously right-away.

3) `.mergePromise(promise)`

Resolves the promise and adds the properties of the returned object to the body object.

4) `.setPromise(key, promise)`

Resolves the promise and adds the returned value with the specified key to the body object.

5) 
