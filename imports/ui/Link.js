import React, { Component } from "react";

export default class Link extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.goToPage(this.props.page);
	}

	render() {
		let page = this.props.page;
		return (
			<div>
				<button
					type="button"
					onClick={this.handleClick}>
					{page}
				</button>
			</div>
		);
	}
}
