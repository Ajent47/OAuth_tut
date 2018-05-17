var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../../models/userModel');

module.exports = function () {
  passport.use(new TwitterStrategy({
      //          consumerKey: 'JLfnBWBGUgw2oF2urc5VTA5Nr',
      //          consumerSecret: '4yGhMunytN6kQQPxp32qtBVqWZbypx63MGyz67R65Y6d30TBLM',
      consumerKey: 'XMdFNmS90OOV8AZcHueuwnerV',
      consumerSecret: 'K82cZEEryygSDDvbZHnyvx20rlxJDTSNZvnHWFUnrDtZb9zJ3R',
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
      passReqToCallback: true
    },

    function (req, accessToken, tokenSecret, profile, done) {

      if (req.user) {
        var query = {};
        if (req.user.google) {
          console.log('google');
          query = {
            'google.id': req.user.google.id
          };
        } else if (req.user.facebook) {
          console.log('facebook');
          query = {
            'facebook.id': req.user.facebook.id
          };
        }
        User.findOne(query, function (error, user) {
          if (user) {
            user.twitter = {};
            user.twitter.id = profile.id;
            user.twitter.token = accessToken;
            user.twitter.tokenSecret = tokenSecret;

            user.save();
            done(null, user);
          }
        })
      } else {
        var query = {
          'twitter.id': profile.id
        };

        User.findOne(query, function (error, user) {
          if (user) {
            console.log("found");
            done(null, user);
          } else {
            console.log("not found");
            var user = new User;
            user.image = profile._json.profile_image_url;
            user.displayName = profile.displayName;
            user.twitter = {};
            user.twitter.id = profile.id;
            user.twitter.token = accessToken;
            user.twitter.tokenSecret = tokenSecret;

            user.save();
            done(null, user);
          }
        });
      }
    }))
};