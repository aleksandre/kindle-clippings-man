var ClientController = function() {

};

ClientController.prototype.doSearch = function(searchCriteria, searchTarget) {
	console.log('ClientController received a search request: <%s>', searchCriteria);

	// Display matching clippings
	var onSearchCompleted = (function(data, status, req) {
		console.log('ClientController received a search request response');
		document.html(data);
	}).bind(this);

	var url = '/search?search-target=' + searchTarget + '&search-criteria=' + searchCriteria;
	window.location.href = url;
};

var IndexViewModel = function(controller) {
	this.controller = controller;

	var doSearch = (function() {
		var searchText = this.searchBox.val(); 
		console.log('IndexViewModel lauched a search request with criteria: <%s>', searchText);
		this.controller.doSearch(searchText, 'anything');
	}).bind(this);

	var doSearchBook = (function(sender) {
		var book = sender.target.text;
		console.log('IndexViewModel lauched a search request for clippings from the book: <%s>', book);
		this.controller.doSearch(book, 'book');
	}).bind(this);

	var doSearchAuthor = (function(sender) {
		var author = sender.target.text;
		console.log('IndexViewModel lauched a search request for clippings from author: <%s>', author);
		this.controller.doSearch(author,'author');
	}).bind(this);

	var bindControls = (function() {
		console.log('IndexViewModel is binding to controls...');
		this.searchButton = $('input[name=do-search]');
		this.searchBox = $('input[name=search-box]');

	}).bind(this);

	var bindEvents = (function() {
		console.log('IndexViewModel is binding events...');
		this.searchButton.on('click', doSearch);
		this.searchBox.keydown((function() {
			if (event.keyCode == 13) {
				doSearch();
			}
		}).bind(this));
		$('a[class^="book-link"]').on('click', doSearchBook);
		$('a[class^="author-link"]').on('click', doSearchAuthor);
	}).bind(this);

	var unBindEvents = (function() {
		console.log('IndexViewModel is unbinding events...');
		this.searchButton.off('click', doSearch);
	}).bind(this);

	bindControls();
	bindEvents();
};


$(document).ready(function() {
	console.log('Client application is loading...');
	var controller = new ClientController();
	var index = new IndexViewModel(controller);
});