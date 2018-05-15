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
		let host = this.props.host;
		let players = this.props.players;
		let language = this.props.language;
		let startPage = this.props.startPage;
		let endPage = this.props.endPage;
		if (inLobby) {
			return <Lobby
				gameId={gameId}
				players={players}
				host={host}
				language={language}
				startPage={startPage}
				endPage={endPage} />;
		}
		if (playing) {
			return <Navigator
				language={language}
				startPage={startPage}
				endPage={endPage} />;
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