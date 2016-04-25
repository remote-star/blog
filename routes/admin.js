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
	  	}
    }
    res.send(JSON.stringify(userData));
  });
});

module.exports = router;
