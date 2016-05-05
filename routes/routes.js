var session = require('express-session');
var settings = require('../settings');

module.exports = function(app) {
	var routes = require('./index');
	var admin = require('./admin');


	app.use('/admin', session({
	  secret: settings.cookieSecret,
	  key: settings.db,//cookie name
	  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
	}));

	app.use('/', routes);
	app.use('/admin', admin);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
};