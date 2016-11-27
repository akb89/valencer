import crypto from 'crypto';
import moment from 'moment';
import ApiErrors from './../exceptions/apiException';
import User from './../models/user';
import config from './../config';

async function verifyApiSignature(ctx, next) {
  const req = ctx.request;
  const host = req.header.host;

  if (host.indexOf('localhost') !== -1 || host.indexOf('127.0.0.1') !== -1) {
    return await next();
  }

  const authorization = req.header.authorization;
  if (!authorization) {
    throw ApiErrors.NoAuthorizationHeaderError;
  }

  const twoPartAuth = authorization.split(':');
  if (twoPartAuth.length !== 2) {
    throw ApiErrors.NoTwoPartAuthorizationError;
  }

  const apiKey = twoPartAuth[0];
  const sign = twoPartAuth[1];
  let apiInfo = await User.find({
    key: apiKey
  });
  if (apiInfo.length === 0) {
    throw ApiErrors.InvalidAPIKey;
  }
  apiInfo = apiInfo[0];


  const timestamp = parseInt(req.header['x-val-timestamp'], 10); // TODO: check radix. Here set
  // to 10
  const testSignature = req.method + ctx.originalUrl + timestamp;
  const hash = crypto.createHmac('sha1', apiInfo.secret).update(testSignature).digest('hex');

  if (hash !== sign) {
    throw ApiErrors.InvalidSignature;
  }

  // Test timestamp
  const now = +moment();
  const legitInterval = [now - config.api.interval[0], now + config.api.interval[1]];

  // Give an interval of 3 seconds
  const intervalIsOkay = (timestamp >= apiInfo.timestamp) ||
    (timestamp >= legitInterval[0] && timestamp <= legitInterval[1]);

  if (!intervalIsOkay) {
    throw ApiErrors.InvalidTimestamp;
  }

  apiInfo.timestamp = now;
  await apiInfo.save();
  return await next(); // TODO: added return here. Check
}

export default {
  authenticate: verifyApiSignature,
};
