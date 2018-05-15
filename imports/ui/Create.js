import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language: "es"
		};
		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
	}

	handleLanguageChange(event) {
		this.setState({
			language: event.target.value
		});
	}

	handleCreate() {
		Meteor.call("games.create",
			this.state.language, 
			(err, gameId) => {
				if (err) throw err;
				this.props.goToGame(gameId);
			}
		);
	}

	render() {
		return (
			<div>
				<h1>Create a game:</h1>
				<label>
					Language:{" "}
					<select
						value={this.state.language}
						onChange={this.handleLanguageChange}>
						<option value="es">Spanish</option>
						<option value="en">English</option>
					</select>
				</label>
				<button
					type="button"
					onClick={this.handleCreate}>
					Create game
				</button>
			</div>
		);
	}
}
