var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/userModel');

module.exports = function () {
  passport.use(new GoogleStrategy({
      clientID: '1004308610759-ju7mp4ffud2deem48roldf7i1ckfpdf2.apps.googleusercontent.com',
      clientSecret: 'jZe2nCRJXqvqae_l99uvw99M',
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function (req, accessToken, refreshToken, profile, done) {
      var query = {
        'google.id': profile.id
      };

      User.findOne(query, function (error, user) {
        if (user) {
          console.log("found");
          done(null, user);
        } else {
          console.log("not found");
          user = new User;
          user.email = profile.emails[0].value;
          user.image = profile._json.image.url;
          user.displayName = profile.displayName;
          user.google = {};
          user.google.id = profile.id;
          user.google.token = accessToken;

          user.save();
          done(null, user);
        }
      })
    }
  ));
}; 