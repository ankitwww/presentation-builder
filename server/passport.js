/* eslint-disable no-console */
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DBModel = require('./dbmodel');

const User = DBModel.user;

module.exports = function PassportWrapper(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ userId: id }, (err, user) => {
      done(err, user);
    });
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          '445326770893-9bt2hlsj3si4vo2093ajg7pb79hofqg8.apps.googleusercontent.com',
        clientSecret: 'ORHB8b8RjXF3ctWyAggGSM4H',
        callbackURL: 'http://localhost:3001/auth/google/callback'
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOneAndUpdate(
          {
            userId: profile.id
          },
          {
            lastAccessDate: new Date(),
            email:
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : '',
            name: profile.displayName
          },
          { upsert: true },
          (err, user) => cb(err, user)
        );
      }
    )
  );
};
