const leaguejs = require('leaguejs');
const api = new leaguejs(process.env.RIOT_API_KEY);
const champions = require('./champions.json');

api.setCache({
	stdTTL: 30
})
api.enableCaching();


async function getGameInformation(summonerName) {

	let id, activeGame;
	try {

		id = await getSummonerID(summonerName);

	} catch (err) {

		return "Summoner not found"
	}
	try {
		activeGame = await getActiveGame(id);
	} catch (err) {

		return "Summoner is not in game"
	}
	//console.log(activeGame.participants[7].summonerId===id);

	let champCode = activeGame.participants.filter(player => player.summonerId === id)[0].championId;
	let champ = getChamp(champCode);


	let time = activeGame.gameStartTime === 0 ? 0 : Date.now() - activeGame.gameStartTime;
	if (time === 0) {

		return summonerName + " has just started a game. They are playing " + champ;
	} else {

		return summonerName + " is in game and has been playing " + champ + " for " + round(time / 60000, 1) + " minutes.";
	}


}


async function getSummonerID(summonerName) {

	return new Promise((resolve, reject) => {
		api.Summoner
			.gettingByName(summonerName)
			.then(data => {
				let id = data.id;
				if (id != null) {
					resolve(id);
				} else {
					reject('Summoner not found');
				}
			})
			.catch(err => {
				'use strict';
				console.log(err);
			});
	});

}

async function getActiveGame(summonerID) {
	return new Promise((resolve, reject) => {
		api.Spectator.gettingActiveGame(summonerID)
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				reject(err);
			});
	});
}

const getChamp = (champCode) => {
	return champions.filter(champion => champion.id === champCode)[0].name;

}


const round = (value, decimals) => {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

module.exports = getGameInformation;