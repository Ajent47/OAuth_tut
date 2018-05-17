var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/userModel');

module.exports = function () {
  passport.use(new FacebookStrategy({
      clientID: '2084030861878436',
      clientSecret: 'f6688d88da5558c47661fe068cff97bf',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      passReqToCallback: true
    },
    function (req, accessToken, tokenSecret, profile, done) {
      var query = {
        'facebook.id': profile.id
      };

      User.findOne(query, function (error, user) {
        if (user) {
          console.log("found");
          done(null, user);
        } else {
          console.log("not found");
          user = new User;
          user.email = profile.emails[0].value;
          //user.image = profile._json.image.url;
          user.displayName = profile.displayName;
          user.facebook = {};
          user.facebook.id = profile.id;
          user.facebook.token = accessToken;

          user.save();
          done(null, user);
        }
      });
    }));
}