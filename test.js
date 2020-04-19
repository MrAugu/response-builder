const { ResponseBuilder } = require("./index");
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
  console.log(syncResponse);
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