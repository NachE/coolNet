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
	
	try {
		stats = fs.lstatSync(filename);
	} catch (e) {
		res.writeHead(404, {'Content-Type': mimeTypes['txt']});
		res.write('HTTP 404 - File Not Found');
		res.end();
		return;
	}
  
	if (stats.isFile()) {
	
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
		var fileStream = fs.createReadStream(filename, {
							'bufferSize': 4 * 1024,
							'autoClose': true
						 }).pipe(res);
		//res.end(); not needed, autoClose do it
		//return;
	}
	
}).listen(8901);