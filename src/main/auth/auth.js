import crypto from 'crypto';
import moment from 'moment';
import ApiErrors from '../exception/apiException';
import User from '../model/userModel';
import config from '../config';

async function verify_api_signature(ctx, next) {
    const req = ctx.request;
    const host = req.header['host']

    if(host.indexOf('localhost') !== -1 || host.indexOf('127.0.0.1') !== -1){
        return await next();
    }

    var authorization = req.header['authorization'];
    if(!authorization){
        throw ApiErrors.NoAuthorizationHeaderError;
    }

    var two_part_auth = authorization.split(':');
    if(two_part_auth.length !== 2){
        throw ApiErrors.NoTwoPartAuthorizationError;
    }

    var api_key = two_part_auth[0];
    var sign    = two_part_auth[1];
    var api_info = await User.find({key: api_key});
    if(api_info.length === 0){
        throw ApiErrors.InvalidAPIKey;
    }
    api_info = api_info[0];


    var timestamp = parseInt(req.header['x-val-timestamp']);
    var test_signature = req.method + ctx.originalUrl + timestamp
    var hash = crypto.createHmac('sha1', api_info.secret).update(test_signature).digest('hex')

    if(hash !== sign){
        throw ApiErrors.InvalidSignature;
    }

    //Test timestamp
    var now = +moment();
    var legit_interval = [ now - config.api.interval[0], now + config.api.interval[1] ];

    //Give an interval of 3 secondes
    var interval_is_okay = (timestamp >= api_info.timestamp) ||
        (timestamp >= legit_interval[0] && timestamp <= legit_interval[1])

    if(!interval_is_okay) {
        throw ApiErrors.InvalidTimestamp;
    }

    api_info.timestamp = now;
    await api_info.save();
    await next();
}

export default {
    auth: verify_api_signature
}
