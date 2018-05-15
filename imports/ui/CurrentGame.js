import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import Lobby from "./Lobby.js";
import Navigator from "./Navigator.js";
import Overview from "./Overview.js";

import { Games } from "../api/games.js";

class CurrentGame extends Component {
	render() {
		let inLobby = this.props.inLobby;
		let playing = this.props.playing;
		let gameId = this.props.gameId;
		let players = this.props.players;
		if (inLobby) {
			return <Lobby
				gameId={gameId}
				players={players} />;
		}
		if (playing) {
			return <Navigator />;
		} else {
			return <Overview />;
		}
	}
}

export default withTracker(props => {
	let gameId = props.gameId;
	if (!Meteor.subscribe("games", gameId).ready()) return {};
	let game = Games.findOne(gameId);
	return game;
})(CurrentGame);