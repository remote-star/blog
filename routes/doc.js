Post = require('../models/post.js');

function savePost(data) {
	var post = new Post(data.id, data.title, data.tags,
		data.updated, data._rev, data._attachments.content.data);
	post.save(function (err, id, rev) {
		if (err) {
			return res.send(500, 'error');
		}
		res.send(JSON.stringify({id: id, rev: rev}));
	});
}

exports.upload = function(req, res, next) {
	Post.get(req.body._id, function(err, post) {
		if (!post) {
			//cannot find such a post, save as a new one.
			savePost(req.body);
		} else {
			//already exists, override with a new rev.
		}
	});
};
exports.upload = function(req, res, next) {
	console.info(req.data);
};
exports.upload = function(req, res, next) {
	console.info(req.data);
};
exports.upload = function(req, res, next) {
	console.info(req.data);
};
