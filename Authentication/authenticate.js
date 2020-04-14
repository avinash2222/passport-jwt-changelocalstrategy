//passport authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.getToken = function(user) {
  return jwt.sign(user, process.env.secretKey,
      {expiresIn: 3600});
};

//passport-jwt strategy for middleware
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
      console.log("JWT payload: ", jwt_payload);
      User.findOne({_id: jwt_payload._id}, (err, user) => {
          if (err) {
              return done(err, false);
          }
          else if (user) {
              return done(null, user);
          }
          else {
              return done(null, false);
          }
      });
  }));


// LOCAL STRATEGY
passport.use("local-login", new LocalStrategy({
    usernameField: 'phone_number',
    passwordField: 'password',
    session: false
  },
  async (phone_number, password, done) => {
    try {
      const user = await User.findOne({ phone_number: phone_number });
      if (!user) return done(null, false);
      const isMatch =  await user.isValidPassword(password);
      if (!isMatch) return done(null, false);
      else return done(null, user);
    } catch(error) {
        return done(error);
    }
  }));




exports.verifyUser = passport.authenticate('jwt', {session: false});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());