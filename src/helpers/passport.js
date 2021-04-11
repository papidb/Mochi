import httpStatus from 'http-status';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import config from '../config';
import tokenTypes from '../config/tokens';
import Models from '../models';
import ApiError from '../utils/ApiError';
const { User } = Models;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt.secret;

const jwtVerify = async function (jwt_payload, done) {
  try {
    if (jwt_payload.type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    const user = await User.findOne({ id: jwt_payload.sub });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
const jwtStrategy = new JwtStrategy(opts, jwtVerify);

export default jwtStrategy;
