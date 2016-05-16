var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var path = require('path');

router.get('/login', function(req, res, next) {
	res.render('admin/login', {
		title: 'Log in'
	});
});

router.post('/login', function (req, res) {
  User.get(req.body.username, function (err, user) {
  	var userData = {};
  	if(err) {
  		userData.code = 'B';
  	} else if (!user) {
  		userData.code = 'W';
    } else {
	    var md5 = crypto.createHash('md5'),
	  	  password = req.body.password;
	  	  saltedPassword = password + 'salty';
	  	  encryptedPassword = md5.update(saltedPassword).digest('hex');
	  	if (user.password != encryptedPassword) {
  			userData.code = 'W';
	  	} else {
  			userData.code = 'R';
  			req.session.user = user;
	  	}
    }
    res.send(JSON.stringify(userData));
  });
});

// router.use('/', function (req, res, next) {
// 	console.info(req.session.user);
//   if (!req.session.user) {
//     res.redirect('/admin/login');
//   } else {
//   	next();
//   }
// });

router.get('/', function (req, res, next) {
	res.render('admin/index', {
		title: 'Admin'
	});
});

router.get('/editor', function (req, res, next) {
	res.sendfile(path.resolve('views/admin/editor.html'));
});

router.get('/downloadImport', require('../app/download').importPublic);

router.get('/post', function (req, res, next) {
  res.render('admin/post', {
    title: '发表帖子'
  });
});


router.post('/pdfExport', require('../app/pdf').export);

router.post('/logout', function (req, res) {
  req.session.user = null;
});

module.exports = router;
