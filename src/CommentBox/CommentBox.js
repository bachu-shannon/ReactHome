import React from 'react';

import CommentList from './CommentList/CommentList';
import CommentForm from './CommentForm/CommentForm';

class CommentBox extends React.Component{

	loadCommentsFromServer(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}

	handleCommentSubmit(comment){
		var comments = this.state.data;

		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});

		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				this.setState({data: comments});
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	}

	constructor(props) {
		super(props);
		this.state = {data: []};
	}

	getInitialState(){
		return {data: []};
	}

	componentDidMount(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	}

	render(){
		return(
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.props.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		)
	}
}

export default CommentBox;