module.exports = (req, res, next) => { // eslint-disable-line no-unused-vars
  res.sendResponse = async (responseBuilder) => {
    const body = await responseBuilder.cast();
    res.set("Content-Type", "application/json");

    if (responseBuilder.code) {
      res.status(responseBuilder.code).send(body);
    } else {
      res.send(body);
    }
  };
  next();
};