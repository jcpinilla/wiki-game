import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
 
export const Games = new Mongo.Collection("games");

if (Meteor.isServer) {
	Meteor.publish("games", function(gameId) {
		return Games.find({_id: gameId});
	});
}

Meteor.methods({
	"games.create"(language) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		let gameId = "" + (Games.find().count() + 1);
		let host = Meteor.user().username;
		let newGame = {
			_id: gameId,
			language,
			host,
			players: [host],
			inLobby: true,
			playing: false,
			winner: null,
			startTime: null,
			endTime: null,

			startPage: null,
			endPage: null,
			graph: {
				nodes: [],
				links: []
			}
		};
		Games.insert(newGame);
		return gameId;
	},
	"games.join"(gameId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		let game = Games.findOne(gameId);
		if (!game) {
			return {
				errorMessage: `The game with ID ${gameId} doesn't exist.`
			};
		}
		let players = game.players;
		let username = Meteor.user().username;
		let alreadyInGame = players.filter(p => p === username).length === 1;
		if (alreadyInGame) {
			return {
				errorMessage: `You are already in the game with ID ${gameId}`
			};
		}
		Games.update(gameId, {$push: {players: username}});
		return {ok: true};
	},
	"games.setStartEndPages"(gameId, startPage, endPage) {
		Games.update(gameId, {
			$set: {
				startPage,
				endPage
			}
		});
	},
	"games.startGame"(gameId) {
		let game = Games.findOne(gameId);
		let startPage = game.startPage;
		Games.update(gameId, {
			$set: {
				inLobby: false,
				playing: true,
				startTime: new Date()
			},
			$push: {
				"graph.nodes": {
					page: startPage
				}
			}
		});
	}
});