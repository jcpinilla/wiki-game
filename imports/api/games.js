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
		let players = {
			[host]: {
				stack: []
			}
		};
		let newGame = {
			_id: gameId,
			language,
			host,
			players,
			inLobby: true,
			playing: false,
			winner: null,
			startTime: new Date(),
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
		if (username in players) {
			return {
				errorMessage: `You are already in the game with ID ${gameId}`
			};
		}
		players[username] = {
			stack: []
		};
		Games.update(gameId, {$set: {players}});
		return {ok: true};
	}
});