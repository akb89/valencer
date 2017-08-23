const crypto = require('crypto');
const moment = require('moment');
const ApiError = require('./../exceptions/apiException');
const User = require('./../models/user');
const config = require('./../config');

async function verifyApiSignature(context, next) {
  const req = context.request;
  const host = req.header.host;

  if (host.indexOf('localhost') !== -1 || host.indexOf('127.0.0.1') !== -1) {
    return next();
  }

  const authorization = req.header.authorization;
  if (!authorization) {
    throw new ApiError.NoAuthorizationHeaderError();
  }

  const twoPartAuth = authorization.split(':');
  if (twoPartAuth.length !== 2) {
    throw new ApiError.NoTwoPartAuthorizationError();
  }

  const apiKey = twoPartAuth[0];
  const sign = twoPartAuth[1];
  let apiInfo = await User.find({
    key: apiKey,
  });
  if (apiInfo.length === 0) {
    throw new ApiError.InvalidAPIKey();
  }
  apiInfo = apiInfo[0];


  const timestamp = parseInt(req.header['x-val-timestamp'], 10);
  // TODO: check radix. Here set to 10

  const testSignature = req.method + context.originalUrl + timestamp;
  const hash = crypto
    .createHmac('sha1', apiInfo.secret)
    .update(testSignature)
    .digest('hex');

  if (hash !== sign) {
    throw new ApiError.InvalidSignature();
  }

  // Test timestamp
  const now = +moment();
  const legitInterval = [now - config.api.interval[0], now + config.api.interval[1]];

  // Give an interval of 3 seconds
  const intervalIsOkay = (timestamp >= apiInfo.timestamp) ||
    (timestamp >= legitInterval[0] && timestamp <= legitInterval[1]);

  if (!intervalIsOkay) {
    throw new ApiError.InvalidTimestamp();
  }

  apiInfo.timestamp = now;
  await apiInfo.save();
  return next(); // TODO: added return here. Check
}

module.exports = {
  authenticate: verifyApiSignature,
};
