
var ClipTool = function() {
	this.fs = require('fs');
	this.readline = require('readline');
	this.stream = require('stream');

	var relativeRequire = require('rekuire');
	this.clipping = relativeRequire('clipping');
}

ClipTool.prototype.import = function(src, des) {
	console.log('ClipTool is importing clippings from: %s', src);

	// Load clippings from file
	var onLoadCompleted = (function(err, clippings) {
		this.saveToFile(clippings, des, onSaveToFileCompleted);
	}).bind(this);

	// Save clippings to a .json file
	var onSaveToFileCompleted = (function(err, result) {
		if (err) {
			console.log(err);
			console.log('ClipTool encountered an error while saving clippings to: %s', des);
		} else {
			console.log('ClipTool is done saving clippings to: %s', des);
		}
	}).bind(this);

	this.loadFromFile(src, onLoadCompleted);
}

ClipTool.prototype.loadFromFile = function(filePath, onLoaded) {
	console.log('ClipTool started reading the following Kindle clipping file: %s', filePath);
	if (!this.fs.existsSync(filePath)) {
    	console.error('ClipTool failed to find the following file: %s', filePath);
    	return null;
	}

	var inStream = this.fs.createReadStream(filePath);
	var outStream = new this.stream();
	
	var fileStream = this.readline.createInterface(inStream, outStream);
	var nextLineIsBook = false;
	var clippings = [];
	var clip = new this.clipping();

	fileStream.on('line', (function(line) {
	  	if (nextLineIsBook) {
	  		// Extract book author
	  		var regExp = /\(([^)]+)\)/;
			var matches = regExp.exec(line);
			clip.author = matches[matches.length - 1].trim();

			// Extract book title
			var lastParenthesesIndex = line.lastIndexOf("(");
			var title = line.substring(0, lastParenthesesIndex - 1);
	  		clip.book = title.trim();

	  		nextLineIsBook = false;
	  	} else {
	  		var firstCharacter = line.substring(0, 2);
	  		switch (firstCharacter) {
		  		case "==":
		  			clippings.push(clip);
		  			clip = new this.clipping();
	        		nextLineIsBook = true;
	   				break;
	   			case "- ":
	   				clip.timestamp = line.substring(2, line.length - 3);
	   				break;
				default:
					clip.text += line.trim();
					break;
			}	
	  	}
	}).bind(this));

	fileStream.on('close', function() {
	  console.log('ClipTool read %d clippings from %s.', clippings.length, des);
	  onLoaded(null, clippings);
	});
}

ClipTool.prototype.saveToFile = function(clippings, des, onSaved) {
	console.log('ClipTool is saving a parsed clipping file to: %s', des);
	
	var formattedClippings = JSON.stringify(clippings, null, 4);
	this.fs.writeFile(des, formattedClippings, onSaved);
};

ClipTool.prototype.read = function(src, onReadCompleted) {
	console.log('ClipTool is reading a JSON clipping file: %s', src);
	
	// Read the entire file and return
	var onFileRead = (function(err, data) {
		var clippings = '';
		if (data) {
			clippings = JSON.parse(data);
		}
		onReadCompleted(err, clippings);
	}).bind(this);

	this.fs.readFile(src, onFileRead);
};

ClipTool.prototype.filterClippings = function(target, criteria, clippings, onFiltered) {
	console.log('ClipTool received a filter request for target <%s> with criteria <%s>', target, criteria);
	var filteredClippings = [];
	criteria = criteria.toLowerCase();

	switch (target) {
		case 'anything':
			console.log('ClipTool is filtering clippings on <anything>');
			clippings.forEach(function(clip) {
				if (clip.book.toLowerCase().indexOf(criteria) > -1 
				|| clip.author.toLowerCase().indexOf(criteria) > -1
				|| clip.text.toLowerCase().indexOf(criteria) > -1) {
					filteredClippings.push(clip);
				}
			});
			break;
		case 'book':
			console.log('ClipTool is filtering clippings on <book>');
			clippings.forEach(function(clip) {
				if (clip.book.toLowerCase() === criteria.toLowerCase()) {
					filteredClippings.push(clip);
				}
			});
			break;
		case 'author':
			console.log('ClipTool is filtering clippings on <author>');
			clippings.forEach(function(clip) {
				if (clip.author.toLowerCase() === criteria.toLowerCase()) {
					filteredClippings.push(clip);
				}
			});
			break;
		default:
			console.error('ClipTool does not support the <%s> target', criteria);
	}

	console.log('ClipTool has found %d matching clippings', filteredClippings.length);
	onFiltered(null, filteredClippings);
};


module.exports = ClipTool;

