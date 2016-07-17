
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function (data) {
	var Book = React.createClass({
		render: function () {
			return (
				<tr key={this.props.id}>
					<td>{this.props.title}</td>
					<td>{this.props.authorName}</td>
					<td>{this.props.authorGender}</td>
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
			return {sample: []};
		},
		componentDidMount: function () {
			this.setState({sample: this.props.data.slice(0,20)});
		},
		select: function (index) {
			this.setState({sample: this.props.data.slice(index * 20, Math.min((index+1) * 20, this.props.data.length))});
		},
		render: function () {
			var bookItems = this.state.sample.map( function(book) {
				return (
					<Book key={book.oid} id={book.oid} title={book.name} authorName={book.author.name} authorGender={book.author.gender} genre={book.genre} publishDate={book.publishDate.toISOString().slice(0, 10)} />
				);
			});
			return (
				<div className="bookshelf">
					<table>
						<thead>
							<tr>
								<th key="title">Title</th>
								<th key="authorName">Author name</th>
								<th key="authorGender">Author gender</th>
								<th key="genre">Genre</th>
								<th key="publishDate">Publish Date</th>
							</tr>
						</thead>
						<tbody>{bookItems}</tbody>
					</table>
					<Pager data={this.props.data} updater={this.select} />
				</div>
			);
		}
	});

	ReactDOM.render(
		<Bookshelf data={data} />,
		document.getElementById('content')
	);

}