import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {
			startPageInput: "",
			endPageInput: ""
		};
		this.handleStartPageInputChange = this.handleStartPageInputChange.bind(this);
		this.handleEndPageInputChange = this.handleEndPageInputChange.bind(this);
		this.handleValidate = this.handleValidate.bind(this);
		this.handleStartGame = this.handleStartGame.bind(this);
	}

	handleStartPageInputChange(event) {
		this.setState({
			startPageInput: event.target.value
		});
	}

	handleEndPageInputChange(event) {
		this.setState({
			endPageInput: event.target.value
		});
	}

	handleValidate() {
		let startPageInput = this.state.startPageInput.trim();
		let endPageInput = this.state.endPageInput.trim();
		if (startPageInput === "" || endPageInput === "") {
			alert("Both pages must be defined.");
			return;
		}
		let language = this.props.language;
		Meteor.call("wiki.validate",
			language,
			startPageInput,
			endPageInput,
			(err, res) => {
				if (res.errorMessage) {
					alert(res.errorMessage);
				} else {
					let gameId = this.props.gameId;
					Meteor.call("games.setStartEndPages",
						gameId,
						res.startPage,
						res.endPage
					);
					console.log("Pages validated");
					this.setState({
						startPageInput: "",
						endPageInput: ""
					});
				}
			}
		);
	}

	handleStartGame() {
		Meteor.call("games.startGame", this.props.gameId);
	}

	render() {
		let gameId = this.props.gameId;
		let players = this.props.players;
		let host = this.props.host;
		let isHost = host === Meteor.user().username;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		let pagesValidated = startPage !== null && endPage !== null;
		let isHostDisplay = (
			<div>
				<div>
					<label>
						Start page:{" "}
						<input
							autoFocus
							type="text"
							value={this.state.startPageInput}
							onChange={this.handleStartPageInputChange} />
					</label>
				</div>
				<div>
					<label>
						End page:{" "}
						<input
							type="text"
							value={this.state.endPageInput}
							onChange={this.handleEndPageInputChange} />
					</label>
				</div>
				<button
					type="button"
					onClick={this.handleValidate}>
					Validate {pagesValidated && "new"} pages
				</button>
				{pagesValidated &&
					<button
						type="button"
						onClick={this.handleStartGame}>
						Start game
					</button>
				}
			</div>
		);
		return (
			<div>
				<h1>Lobby of game {gameId}</h1>
				{pagesValidated &&
					<div>
						<h2>Game ready</h2>
						<h3>Waiting for {isHost ? "you" : host} to start the game</h3>
						<p>Start page: {startPage}</p>
						<p>End page: {endPage}</p>
					</div>
				}
				{isHost && isHostDisplay}
				<h2>Players:</h2>
				{
					players.map(player => 
						<div key={player}>{player}</div>
					)
				}
			</div>
		);
	}
}
