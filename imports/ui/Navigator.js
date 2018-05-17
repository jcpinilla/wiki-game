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
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleEndGameByHost = this.handleEndGameByHost.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyPress);
		this.goToPage(this.props.startPage);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyPress);
	}

	handleKeyPress(event) {
		if (event.key === "w") {
			this.goBack();
		}
	}

	goToPage(page) {
		let stack = this.state.stack;
		if (stack.length !== 0) {
			let currentPage = stack[stack.length-1];
			let gameId = this.props.gameId;
			Meteor.call("games.navigate", gameId, currentPage, page);
		}
		if (page === this.props.endPage) {
			this.endGame(Meteor.user().username);
			return;
		}
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

	goBack() {
		let stack = this.state.stack;
		if (stack.length === 1) return;
		Meteor.call(
			"wiki.getLinks",
			this.props.language,
			stack[stack.length-2],
			(err, links) => {
				this.setState(state => {
					let newStack = state.stack;
					newStack.pop();
					return {
						stack: newStack,
						links
					};
				});
			}
		);
	}

	handleEndGameByHost() {
		this.endGame(null);
	}

	endGame(winner) {
		Meteor.call("games.endGame", this.props.gameId, winner);
	}

	render() {
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let stack = this.state.stack;
		let links = this.state.links;
		let currentPage = stack[stack.length-1];
		let host = this.props.host;
		let isHost = host === Meteor.user().username;
		return (
			<div>
				<h1>Navigator</h1>
				{isHost &&
					<button
						type="button"
						onClick={this.handleEndGameByHost}>
						End game
					</button>
				}
				<p><em>Press <strong>w</strong> to go back</em></p>
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
