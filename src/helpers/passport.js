import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import config from '../config';
import Models from '../models';
const { User } = Models;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt.secret;

const jwtStrategy = new JwtStrategy(opts, async function (jwt_payload, done) {
  return await User.findOne({ id: jwt_payload.sub })
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    })
    .catch(err => {
      return done(err, false);
    });
});

export default jwtStrategy;
