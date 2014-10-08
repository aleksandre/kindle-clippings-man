var Clipping = function(author, book, timestamp, text) {
	this.author = author || '';
	this.book = book || '';
	this.timestamp = timestamp || '';
	this.text = text || '';
}

Clipping.prototype.toString = function() {
    return this.author + " " + this.book + " " + this.timestamp;
}

module.exports = Clipping;
