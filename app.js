
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true, /*uploadDir: '/my/files'*/ }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/api/upload', function(req, res) {
	
	var saveFile = function(item) {
		fs.readFile(item.path, function(err, data) {
			var newPath = __dirname + "/out/" + path.basename(item.path);
			fs.writeFile(newPath, data, function(err) {
				res.send({
					"ok": true
				});
			});
		});
	}
	if( req.files.file1 instanceof Array )
		req.files.file1.forEach( function(item) {
			saveFile(item);
		})
	else
		saveFile(req.files.file1);	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
