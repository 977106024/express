var express = require('express');
var router = express.Router();

var passport = require('passport');//用于认证相关的
var GitHubStrategy = require('passport-github').Strategy; //github登陆模块
var JirenguStrategy = require('passport-jirengu').Strategy;


passport.serializeUser(function(user, done) { //用户信息生成sessions
  done(null, user);
});

passport.deserializeUser(function(obj, done) { //取出sessions
    done(null, obj);
});

passport.use(new JirenguStrategy({
  clientID: '7c66a265d5476655fcdb24adcc23133445d166565fc43ef89ee1cc3d0c6cf40b',
  tokenURL: 'http://user.jirengu.com/oauth/token',
  clientSecret: 'afc796e5fa1b8e4448c0324c9e97b52719c4b87edbdde3aa375c4f8141be8ddb',
  callbackURL: "http://note.ruoyu.site/auth/jirengu/callback"},
  function(accessToken, refreshToken, profile, done) {
    done(null, profile)
  }));

passport.use(new GitHubStrategy({
    clientID: '2750ef3d6f419fda9824',  //id
    clientSecret: '3a72eeed69ba644bf861c2b0ef5c574a7384a28f', //密匙
    callbackURL: "http://localhost:3000/auth/github/callback"  //回调地址
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    // });
    done(null, profile);
  }
));

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = {   //信息放入session
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,   //图片
      provider: req.user.provider  //认证服务器
    };
    res.redirect('/');
  });


router.get('/jirengu',
  passport.authenticate('jirengu'));

router.get('/jirengu/callback',
  passport.authenticate('jirengu', { failureRedirect: '/' }),
  function(req, res) {
    console.log('success......')
    console.log(req.user);
    req.session.user = {
      id: req.user._json.uid,
      username: req.user._json.name,
      avatar: req.user._json.avatar,
      provider: req.user.provider
    };
    res.redirect('/');
  });

router.get('/logout',function(req,res){ //注销
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
