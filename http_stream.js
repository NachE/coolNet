var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');
	
var mimeTypes = {
	'txt': 'text/plain',
	'html': 'text/html',
	'jpg': 'image/jpeg',
	'png': 'image/png',
	'gif': 'image/gif',
	'js': 'text/javascript',
	'css': 'text/css',
	'json': 'application/json',
	'*': 'application/octet-stream'};
	
var rootPath = "C:\\cygwin\\"; //TODO: Use config file

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	var filename = path.join(rootPath, unescape(uri));
	var stats;
	console.log("File req: " + filename);
	
	//
	fs.lstat(filename, function(err,stats){
	
		if ( !(typeof stats === "undefined") && stats.isFile()) {
	
			var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
		
			if (typeof mimeType === "undefined")
				mimeType = mimeTypes["*"];
			
			res.writeHead(200, {'Content-Type': mimeType} );
			// From API DOC:
			//
			// An example to read the last 10 bytes of a file which is 100 bytes long:
			// fs.createReadStream('sample.txt', {start: 90, end: 99});
			//
			// If autoClose is set to true (default behavior), on error or end the 
			// file descriptor will be closed automatically.
			//
			// I have been see 'bufferSize': 4 * 1024 in some code, see later
			// autoClose is default to true, but I like to sure
			var fileStream = fs.createReadStream(filename, {
								'autoClose': true
							}).pipe(res);
			//res.end(); not needed, autoClose do it
			//return;
			
		
		}else if( err != null && err.errno == 34 ){
		//if no error, err.errno = null
		
			res.writeHead(404, {'Content-Type': mimeTypes['txt']});
			res.write('HTTP 404 - File Not Found');
			res.end();
			return;
		
		}else{
		
			res.writeHead(500, {'Content-Type': mimeTypes['txt']});
			res.write('HTTP 500 - Internal Server Error');
			res.end();
			return;
			
		}
	});
	
}).listen(8901);