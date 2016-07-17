
var bookshelf = require('./bookshelf-domain');
var loadComponents = require('./components');

var authorIndex = new AuthorIndex();
var books = [];

//$('document').ready( function () {
//	init();
//	var html = '<ul>';
//	for (var i = 0; i < books.length; i++) {
//		var book = books[i];
//		html += '<li>Name: ' + book.name + ' Author: ' + book.author.name  + ' Genre: ' + book.genre + ' Publish Date: ' + book.publishDate.toDateString() + '</li>';
//	}
//	html += '</ul>';
//	$('body').append(html);
//});

function init () {
	createAuthors();
	createBooks();
	loadComponents(books);
}

function createAuthors () {
	var givenNames = {
		'male': ['Arthur', 'James', 'Duncan', 'Kieran', 'George', 'Kurt', 'Michael', 'Robert', 'Liam', 'David'],
		'female': ['Zoe', 'Helen', 'Ophelia', 'Chloe', 'Adelaide', 'Virginia', 'Charlotte', 'Julie', 'Beatrice', 'Judy', 'Sophie']
	};

	var familyNames = ['Snyder', 'Owen', 'O\'Shea', 'Eckleton', 'McIntosh', 'Starr', 'Crawford', 'Thomson', 'Alston', 'Stuart', 'Abbot', 'Fairchild'];

	function createAuthor () {
		function rand(max) {
			return Math.floor(Math.random() * max);
		}
		var isamatch = true;
		var gender, givenName, familyName;
		while (isamatch) {
			gender = (rand(2) == 0 ? 'male' : 'female');
			givenName = givenNames[gender][rand(givenNames[gender].length)];
			familyName = familyNames[rand(familyNames.length)];
			isamatch = authorIndex.isPresent(givenName, familyName);
		}
		var author = new bookshelf.Author({'gender' : gender, 'name' : givenName + ' ' + familyName});
		authorIndex.add(author);
		return author;
	}

	for (var i = 0; i < 30; i++) {
		createAuthor();
	}
}

function AuthorIndex () {
	this.index = [];
}
AuthorIndex.prototype.isPresent = function (givenName, familyName) {
	return this.index[givenName] && this.index[givenName][familyName];
};
AuthorIndex.prototype.add = function (author) {
	var givenName = author.name.split(' ')[0];
	var familyName = author.name.split(' ')[1];
	if (!this.index[givenName]) {
		this.index[givenName] = [];
	}
	this.index[givenName][familyName] = author;
};
AuthorIndex.prototype.getRandom = function () {
	function randomElement (array) {
		var keys = Object.keys(array);
		return array[keys[Math.floor(Math.random() * keys.length)]];
	}
	var givenNameIndex = randomElement(this.index);
	return randomElement(givenNameIndex);
};
AuthorIndex.prototype.get = function (givenName, familyName) {
	var givenNameIndex = this.index[givenName];
	if (!givenNameIndex) {
		return;
	}
	return givenNameIndex[familyName];
};

function createBooks () {
	function randomInRange(min, maxExcl) {
		return Math.floor(Math.random() * (maxExcl - min)) + min;
	}

	var title = 'The Book of Things ';
	var genres = ['novel', 'scifi', 'crime novel', 'historic novel', 'essay', 'play', 'biography', 'comics', 'adventure'];
	var start = (new Date(1984, 5, 24)).getTime();
	var end = (new Date()).getTime();

	for (var i = 0; i < 1000; i++) {
		var book =  new bookshelf.Book({
			'name' : title + (i+1),
			'author' : authorIndex.getRandom(),
			'genre' : genres[randomInRange(0, genres.length)],
			'publishDate' : new Date(randomInRange(end, start))
		});
		books.push(book);
	}
}

init();
