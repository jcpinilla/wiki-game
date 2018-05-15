import React, { Component } from "react";

export default class Lobby extends Component {
	render() {
		let gameId = this.props.gameId;
		let players = this.props.players;
		let playersArray = [];
		for (let player in players) {
			playersArray.push(<div key={player}>{player}</div>);
		}
		return (
			<div>
				<h1>Lobby of game {gameId}</h1>
				<h2>Players:</h2>
				{playersArray}
			</div>
		);
	}
}
