import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Join extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameIdInput: ""
		};
		this.handleJoin = this.handleJoin.bind(this);
		this.handleGameIdInputChange = this.handleGameIdInputChange.bind(this);
	}

	handleJoin(event) {
		event.preventDefault();
		let gameIdInput = this.state.gameIdInput;
		if (gameIdInput === "") return;
		Meteor.call("games.join",
			gameIdInput,
			(err, res) => {
				if (err) throw err;
				if (res.ok) {
					this.props.goToGame(gameIdInput);
				} else {
					alert(res.errorMessage);
				}
			}
		);
	}

	handleGameIdInputChange(event) {
		let gameIdInput = event.target.value;
		if (!/^\d*$/.test(gameIdInput)) return;
		this.setState({
			gameIdInput
		});
	}

	render() {
		return (
			<div>
				<h1>Join a game:</h1>
				<form onSubmit={this.handleJoin}>
					<label>
						Enter the game ID:{" "}
						<input
							autoFocus
							type="text"
							value={this.state.gameIdInput}
							onChange={this.handleGameIdInputChange} />
					</label>
				</form>
			</div>
		);
	}
}
