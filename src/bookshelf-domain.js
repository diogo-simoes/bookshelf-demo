
var domain = {};

( function (namespace) {

	var getOid = (function () {
		var cnt = 0;
		var paddy = function (num, pad) {
			return (new Array(pad + 1 - num.toString().length)).join('0') + num;
		}
		return function () {
			return paddy(cnt++, 16);
		}
	})();

	function DomainObject () {
		this.oid = this.constructor.name + ':' + getOid();
	}

	Book.prototype = Object.create(DomainObject.prototype);
	Book.prototype.constructor = Book;
	function Book (conf) {
		DomainObject.call(this);
		this.name = (conf && conf.name ? conf.name : 'Untitled');
		this.author = (conf && conf.author ? conf.author : undefined);
		this.genre = (conf && conf.genre ? conf.genre : 'Unclassified');
		this.publishDate = (conf && conf.publishDate ? conf.publishDate : new Date("1-1-1900"));
	};
	namespace.Book = Book;

	Author.prototype = Object.create(DomainObject.prototype);
	Author.prototype.constructor = Author;
	function Author (conf) {
		DomainObject.call(this);
		this.name = (conf && conf.name ?  conf.name : 'John Doe');
		this.gender = (conf && conf.gender ? conf.gender : 'male');
	}
	namespace.Author = Author;

} )(domain);

module.exports = domain;
