import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

import Link from "./Link.js";

export default class Navigator extends Component {
	constructor(props) {
		super(props);
		this.goToPage = this.goToPage.bind(this);
		this.state = {
			stack: [],
			links: null
		};
	}

	componentDidMount() {
		this.goToPage(this.props.startPage);
	}

	goToPage(page) {
		Meteor.call(
			"wiki.getLinks",
			this.props.language,
			page,
			(err, links) => {
				this.setState(state => {
					let stack = state.stack;
					stack.push(page);
					return {
						stack,
						links
					};
				});
			}
		);
	}

	render() {
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let stack = this.state.stack;
		let links = this.state.links;
		let currentPage = stack[stack.length-1];
		return (
			<div>
				<h1>Navigator</h1>
				<p>Start page: {startPage}</p>
				<p>End page: {endPage}</p>
				<h2>Currently in {currentPage}</h2>
				{links &&
					<div>
						<h2>Links for this page:</h2>
						{
							links.map(link =>
								<Link
									key={link}
									page={link}
									goToPage={this.goToPage} />
							)
						}
					</div>
				}
			</div>
		);
	}
}
