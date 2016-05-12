var mongodb = require('./db');
var crypto = require('crypto');

function Post(id, title, tags, updated, rev, content) {
	this.id = id;
	this.title = title;
	this.tags = tags;
	this.updated = updated;
	this.rev = rev;
	this.content = content;
}

module.exports = Post;

Post.prototype.getRev = function() {
	var edition = 1, rev,
		md5 = crypto.createHash('md5'),
		code = md5.update(this.content).digest('hex');
	if (this.rev) {
		edition = parseInt(this.rev.split('-')[0]);
	}
	rev = edition + '-' + md5;
}
//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
	//要存入数据库的文档
	var post = {
		id: this.id,
		title: this.title,
		tags: this.tags,
		updated: this.updated,
		_rev: this.getRev(),
		content: this.content,
	};
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//将文档插入 posts 集合
			collection.insert(post, {
				safe: true
			}, function (err, result) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null);//返回 err 为 null
			});
		});
	});
};

//读取文章及其相关信息
Post.get = function(id, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (id) {
				query.id = id;
			}
			//根据 query 对象查询文章
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null, docs);//成功！以数组形式返回查询的结果
			});
		});
	});
};
