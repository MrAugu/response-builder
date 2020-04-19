const httpCodes = require("../httpCodes");

class ResponseBuilder {
  constructor () {
    this.object = {};
    this.keyPromises = {};
    this.mergePromises = [];
    this.code = 200;
    this.codeMessage = httpCodes.HTTP_200;
  }

  set (key, value) {
    if (!key) throw new TypeError("Key must be specified.");
    this.object[key] = value;
    return this;
  }
  
   setAsync (key, value) {
    if (!key) throw new TypeError("Key must be specified.");
    new Promise((resolve, reject) => {
      value.then(result => {
        this.object[key] = result;
        resolve(result);
      }).catch(e => {
        reject(e);
      });
    });
    return this;
  }

  mergePromise (promise) {
    if (!promise) throw new TypeError("A promise must be specified.");
    this.mergePromises.push(promise);
    return this;
  }

  setPromise(key, promise) {
    if (!key) throw new TypeError("Key must be specified.");
    this.keyPromises[key] = promise;
    return this;
  }

  merge (object) {
    Object.assign(this.object, object);
    return this;
  }

  async cast (useCode = true) {
    if (useCode) this.object.httpCode = this.code;
    if (useCode) this.object.httpCodeMessage = this.codeMessage;

    for (const promiseKey of Object.keys(this.keyPromises)) {
      const promise = this.keyPromises[promiseKey];
      this.object[promiseKey] = await promise;
    }

    for (const promise of this.mergePromises) {
      const promiseResult = await promise;
      if (!isObject(promiseResult)) continue;
      Object.assign(this.object, promiseResult);
    }

    return this.object;
  }

  castSync (useCode = true) {
    if (useCode) this.object.httpCode = this.code;
    if (useCode) this.object.httpCodeMessage = this.codeMessage;
    
    return this.object;
  }

  setCode (httpCode, message) {
    this.code = httpCode;
    if (!message) this.codeMessage = httpCodes[`HTTP_${httpCode}`]
    else this.codeMessage = message;
    return this;
  }
}

function isObject (obj) {
  try {
    JSON.stringify(obj);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = ResponseBuilder;