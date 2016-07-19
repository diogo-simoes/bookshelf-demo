
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function (data) {
	var Book = React.createClass({
		render: function () {
			return (
				<tr key={this.props.id}>
					<td>{this.props.title}</td>
					<td>{this.props.authorName}</td>
					<td>{this.props.genre}</td>
					<td>{this.props.publishDate}</td>
				</tr>
			);
		}
	});

	var Pager = React.createClass({
		getInitialState: function () {
			return {presentIndex: 0};
		},
		renderFirst: function () {
			var firstIndex = 0;
			if (this.state.presentIndex === firstIndex) {
				return (<a className="pager-disabled">&#x23ee;</a>);
			} else {
				return (<a onClick={this.newPage.bind(this, firstIndex)}>&#x23ee;</a>);
			}
		},
		renderPrev: function () {
			var firstIndex = 0;
			if (this.state.presentIndex === firstIndex) {
				return (<a className="pager-disabled">&#x25c0;</a>);
			} else {
				return (<a onClick={this.newPage.bind(this, this.state.presentIndex - 1)}>&#x25c0;</a>);
			}
		},
		renderNext: function () {
			var lastIndex = Math.ceil(this.props.data.length / 20.0) - 1;
			if (this.state.presentIndex === lastIndex) {
				return (<a className="pager-disabled">&#x25b6;</a>);
			} else {
				return (<a onClick={this.newPage.bind(this, this.state.presentIndex + 1)}>&#x25b6;</a>);
			}
		},
		renderLast: function () {
			var lastIndex = Math.ceil(this.props.data.length / 20.0) - 1;
			if (this.state.presentIndex === lastIndex) {
				return (<a className="pager-disabled">&#x23ed;</a>);
			} else {
				return (<a onClick={this.newPage.bind(this, lastIndex)}>&#x23ed;</a>);
			}
		},
		newPage: function (index) {
			this.setState({presentIndex: index});
			this.props.updater(index);
		},
		render: function () {
			var lastIndex = Math.ceil(this.props.data.length / 20.0);
			return (
				<div className="pager">
					{this.renderFirst()} {this.renderPrev()} <span>{this.state.presentIndex + 1} of {lastIndex}</span> {this.renderNext()} {this.renderLast()}
				</div>
			);
		}
	});

	var Bookshelf = React.createClass({
		getInitialState: function () {
			return {mode: 'title', workset: [], view: [], page: 0};
		},
		componentDidMount: function () {
			var workset = this.props.data.getSortedByTitle();
			var page = this.state.page;
			this.setState({
				workset: workset,
				view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
			});
		},
		select: function (index) {
			var page = typeof(index) !== 'undefined' ? index : this.state.page;
			this.setState({
				view: this.state.workset.slice(page * 20, Math.min((page+1) * 20, this.state.workset.length)),
				page: page
			});
		},
		reorderByTitle: function () {
			var page = this.state.page;
			if (this.state.mode !== 'title') {
				var workset = this.props.data.getSortedByTitle();
				this.setState({
					mode: 'title',
					workset: workset,
					view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
				});
			} else {
				var workset = this.state.workset.reverse();
				this.setState({
					workset: workset,
					view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
				});
			}
		},
		reorderByAuthor: function () {
			var page = this.state.page;
			if (this.state.mode !== 'author') {
				var workset = this.props.data.getSortedByAuthor();
				this.setState({
					mode: 'author',
					workset: workset,
					view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
				});
			} else {
				var workset = this.state.workset.reverse();
				this.setState({
					workset: workset,
					view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
				});
			}
		},
		filterByGenre: function () {
			var page = this.state.page;
			var workset = this.props.data.filter('comics');
			this.setState({
				workset: workset,
				view: workset.slice(page * 20, Math.min((page+1) * 20, workset.length))
			});
		},
		render: function () {
			var bookItems = this.state.view.map( function(book) {
				return (
					<Book key={book.oid} id={book.oid} title={book.name} authorName={book.author.name} genre={book.genre} publishDate={book.publishDate.toISOString().slice(0, 10)} />
				);
			});
			return (
				<div className="bookshelf">
					<table>
						<thead>
							<tr>
								<th key="title" onClick={this.reorderByTitle}>Title</th>
								<th key="authorName" onClick={this.reorderByAuthor}>Author name</th>
								<th key="genre" onClick={this.filterByGenre}>Genre</th>
								<th key="publishDate">Publish Date</th>
							</tr>
						</thead>
						<tbody>{bookItems}</tbody>
					</table>
					<Pager data={this.state.workset} updater={this.select} />
				</div>
			);
		}
	});

	ReactDOM.render(
		<Bookshelf data={data} />,
		document.getElementById('content')
	);

}