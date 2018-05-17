var express = require('express');
var router = express.Router();
var twitter = require('../servives/twitter')('XMdFNmS90OOV8AZcHueuwnerV', 'K82cZEEryygSDDvbZHnyvx20rlxJDTSNZvnHWFUnrDtZb9zJ3R');

router.use('/', function (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  next();
});

router.use('/', function (req, res, next) {
  if (req.user.twitter) {
    twitter.getUserTimeLine(req.user.twitter.token, req.user.twitter.tokenSecret, req.user.twitter.id, function (results) {
      req.user.twitter.lastPost = results[0].text;
      next();
    });
  }
});

/* GET users listing. */
router.get('/', function (req, res) {
  res.render('users', {
    user: req.user
  });
});

module.exports = router;