var https = require('https');
var zlib = require('zlib');
var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
var s3 = new AWS.S3();

var BUCKET = 'status.stillery.co';
var KEY = 'status.json.gz';
var TEST_URL = 'https://test.url/';

function get(then) {
	s3.getObject({ Bucket: BUCKET, Key: KEY }, function(err, data) {
		if (err && err.code !== 'NoSuchKey') {
			return console.error(err);
		}

		if (data.Body) {
			zlib.gunzip(data.Body, function(err, buf) {
				if (err) return console.log(err);
				then(JSON.parse(buf.toString()));
			});
		} else {
			then([]);
		}
	});
}

function update(then) {
	return function(data) {
		var req = https.request(TEST_URL, function(res) {
			var up = (res.statusCode === 200);
			data.push(up ? 1 : 0);

			then(data);
		});
		req.setTimeout(3000, function(res) {
			data.push(0);
			then(data);
		});
		req.end('');
	};
}

function store(done) {
	return function(data) {
		zlib.gzip(JSON.stringify(data), function(err, buf) {
			if (err) return console.error(err);
			s3.putObject({
				Bucket: BUCKET,
				Key: KEY,
				Body: buf,
				ContentType: 'application/json',
				ContentEncoding: 'gzip'
			}, function(err, data) {
				if (err) console.error(err);
				else done();
			});
		});
	};
}

function done(context) {
	return function() {
		context.succeed('Status updated');
	};
}

exports.handler = function(event, context) {
	get(update(store(done(context))));
};
