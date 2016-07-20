
var bookshelf = require('./bookshelf-domain');
var loadComponents = require('./components');

var authorIndex = new AuthorIndex();
var bookIndex = new BookIndex();

function init () {
	createAuthors();
	createBooks();
	loadComponents(bookIndex);
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
	this.indexByName = [];
	this.pointer = 0;
}
AuthorIndex.prototype.isPresent = function (givenName, familyName) {
	return this.indexByName[givenName] && this.indexByName[givenName][familyName];
};
AuthorIndex.prototype.add = function (author) {
	var givenName = author.name.split(' ')[0];
	var familyName = author.name.split(' ')[1];
	if (!this.indexByName[givenName]) {
		this.indexByName[givenName] = [];
	}
	this.indexByName[givenName][familyName] = author;
	this.index.push(author);
};
AuthorIndex.prototype.getRandom = function () {
	function randomElement (array) {
		var keys = Object.keys(array);
		return array[keys[Math.floor(Math.random() * keys.length)]];
	}
	// The round-robin cuts the startup time up to 4s when generating 1M records when compared to the random generator.
	var author = this.index[this.pointer];
	this.pointer = (++this.pointer) % this.index.length;
	return author;
};
AuthorIndex.prototype.get = function (givenName, familyName) {
	var givenNameIndex = this.indexByName[givenName];
	if (!givenNameIndex) {
		return;
	}
	return givenNameIndex[familyName];
};

function BookIndex () {
	this.indexByTitle = [];
	this.sortedByTitle = [];

	this.indexByAuthor = [];
	this.authorKeys = [];
	this.sortedByAuthor = [];

	this.comparator = function (el1, el2) {
		var title1 = el1.name;
		var title2 = el2.name;
		var length = Math.max(title1.length, title2.length);
		for (var i = 0; i < length; i++) {
			if (title1[i] === undefined) {
				return -1;
			}
			if (title2[i] === undefined) {
				return 1;
			}
			if (title1[i] < title2[i]) {
				return -1;
			} else if (title1[i] > title2[i]) {
				return 1;
			}
		}
		return 0;
	};

	this.genres = ['novel', 'scifi', 'crime novel', 'historic novel', 'essay', 'play', 'biography', 'comics', 'adventure', 'horror'];
}

BookIndex.prototype.add = function (book) {
	this.indexByTitle.push(book);

	if (this.authorKeys.indexOf(book.author.name) === -1) {
		this.authorKeys.push(book.author.name);
		this.indexByAuthor[book.author.name] = [];
	}
	this.indexByAuthor[book.author.name].push(book);
};

BookIndex.prototype.getSortedByTitle = function () {
	if (this.sortedByTitle.length == 0) {
		this.sortedByTitle = this.indexByTitle.sort(this.comparator);
	}
	return this.sortedByTitle;
}

BookIndex.prototype.getSortedByAuthor = function () {
	if (this.sortedByAuthor.length == 0) {
		var result = [];
		this.authorKeys.sort();
		for (var i = 0; i < this.authorKeys.length; i++) {
			var orderedBooks = this.indexByAuthor[this.authorKeys[i]].sort(this.comparator);
			this.indexByAuthor[this.authorKeys[i]] = orderedBooks;
			result = result.concat(orderedBooks);
		}
		this.sortedByAuthor = result;
	}
	return this.sortedByAuthor;
}

BookIndex.prototype.filter = function (filter) {
	var result = [];
	this.sortedByTitle.forEach( function (el) {
		if (filter(el)) {
			result.push(el);
		}
	});
	return result;
}


function createBooks () {
	function randomInRange(min, maxExcl) {
		return Math.floor(Math.random() * (maxExcl - min)) + min;
	}

	function randomName() {
		var name = [];
		for (var i = 0; i < 16; i++) {
			name[i] = String.fromCharCode(randomInRange(97, 123));
		}
		return name.join('');
	}

	var genres = bookIndex.genres;
	var start = (new Date(1984, 5, 24)).getTime();
	var end = (new Date()).getTime();

	for (var i = 0; i < 100; i++) {
		var book =  new bookshelf.Book({
			'name' : randomName(),
			'author' : authorIndex.getRandom(),
			'genre' : genres[randomInRange(0, genres.length)],
			'publishDate' : new Date(randomInRange(end, start))
		});
		bookIndex.add(book);
	}
}

init();
