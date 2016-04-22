var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {
    title: 'Log in'
  });
});

router.post('/login', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      return res.redirect('/admin');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      return res.redirect('/admin');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
  });
});

module.exports = router;
