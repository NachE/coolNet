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

function pathJoin_alexway(uri,file){
	var joined_path = path.join(uri, file);
	var normalized = path.normalize( joined_path );
	var splitted = normalized.split(path.delimiter);
	var joined = splitted.join("/");
	var parsed = url.parse(joined);
	return url.format(parsed);
}

function pathJoin(uri,file){
	return url.format(url.parse(
		path.normalize( path.join(uri, file) )
			.split(path.delimiter)
				.join("/")
	));
}

function listDir(pathToList, res, req){
	//console.log(res);
	var pathToList = typeof pathToList !== 'undefined' ? pathToList : rootPath;
	var uri = url.parse(req.url).pathname;
	var filename = "";
	var stats = "";
	
	res.write('<html><body><ul>');
	res.write('<li>[dir] <a href="'+path.join(uri, "..")+'">[ .. ]</a></li>');
	fs.readdirSync(pathToList).forEach(function(file){
	
		filename = path.join(pathToList, file);
		stats = fs.lstatSync(filename);
		if (stats.isFile()){
				
			res.write('<li>[fil] <a href="'+pathJoin(uri, file)+'">'+file+'</a></li>');
				
		} else if (stats.isDirectory()){
			
			res.write('<li>[dir] <a href="'+pathJoin(uri, file)+'">'+file+'</a></li>');
				
		}	
		
	});
	
	res.write('</ul></body></html>');
}

//TODO: finish this function
function listDirJSON(pathToList){
	var pathToList = typeof pathToList !== 'undefined' ? pathToList : rootPath;
	
	var dirlsObj = {};
	dirlsObj.dirs = [];
	dirlsObj.files = [];
	var filename = "";

	fs.readdirSync(pathToList).forEach(function(file){

		filename = path.join(pathToList, file);
		try{

			stats = fs.lstatSync(filename);
			if (stats.isFile())
				dirlsObj.files.push(file)
				
			else if (stats.isDirectory())
				dirlsObj.dirs.push(file)
		
		} catch (e) {
		
			console.log("Error reading "+filename);
			
		}
		
	});
	
	return JSON.stringify(dirlsObj);
}

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
		//An example to read the last 10 bytes of a file which is 100 bytes long:
		//fs.createReadStream('sample.txt', {start: 90, end: 99});
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
		res.end();
		return;
		
	} else if (stats.isDirectory()) {
		res.writeHead(200, {'Content-Type': mimeTypes['html']});
		listDir(filename, res, req);//TODO ugly function, improve 
		res.end();
		return;
	} else {

		res.writeHead(500, {'Content-Type': mimeTypes['txt']});
		res.write('HTTP 500 - Internal Server Error');
		res.end();
		return;
	}
}).listen(8900);