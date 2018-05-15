import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import CreateJoin from "./CreateJoin.js";
import CurrentGame from "./CurrentGame.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gameId: null
		};
		this.goToGame = this.goToGame.bind(this);
	}

	goToGame(gameId) {
		this.setState({
			gameId
		});
	}

	render() {
		let gameId = this.state.gameId;
		let currentUser = this.props.currentUser;
		return (
			<div>
				<AccountsUIWrapper />
				{currentUser &&
					(gameId ?
						<CurrentGame gameId={gameId} />:
						<CreateJoin goToGame={this.goToGame} />)
				}
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		currentUser: Meteor.user()
	};
})(App);