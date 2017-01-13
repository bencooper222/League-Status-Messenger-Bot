var key = 'b8d61b09-33c2-4b82-b0ea-a06e785e7bb8';


/*fs.readFile('apiKey.txt', 'utf8', function(err, data) {

    key = data;
    console.log(key);
});
*/


function requestSummonerId(summonerName, matchMethod, bot, message) {

    var options = {
        host: 'na.api.pvp.net',
        path: '/api/lol/na/v1.4/summoner/by-name/',
        method: 'GET'
    };

    options.path += (summonerName + "?"); // add name to request
    options.path += ("api_key=" + key); // add appikey

    //console.log('good');
    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var data = JSON.parse(str);
            //   console.log(data);

            if (Object.keys(data)[0] == "status") {
                bot.reply(message, "Summoner not found.");
            } else {
                matchMethod(data[summonerName.toLowerCase()].id, bot, message);
            }


        });
    }

    https.request(options, callback).end();
}


var findMatch = function(id, bot, message) {

    var options = {
        host: 'na.api.pvp.net',
        path: '/observer-mode/rest/consumer/getSpectatorGameInfo/NA1/',
        method: 'GET'
    };

    options.path += (id + "?"); // add name to request
    options.path += ("api_key=" + key); // add appikey

    //console.log('good');
    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var data = JSON.parse(str);
            //     console.log(data);
            processGameData(data, id, bot, message)

        });
    }

    https.request(options, callback).end();
}

function processGameData(data, id, bot, message) {
    if (Object.keys(data)[0] == "status") {
        if (message.text.toLowerCase() == "avol9") {
            bot.reply(message, "Summoner not in game. Thank god.");
        } else {
            bot.reply(message, "Summoner not in game.");
        }
    } else {
        //console.log(data);
        console.log(getChamp(data, id, bot, message));
    }
}

function formatGameData(data, champ, bot, message) {
    if (message.text.toLowerCase() == "avol9") {
        bot.reply(message, "They are in game and have been playing " + champ + " for " + Math.floor(data.gameLength / 60) +
            ":" + data.gameLength % 60 + " minutes. Probably feeding because it's Avol.");
    } else {
        bot.reply(message, "They are in game and have been playing " + champ + " for " + Math.floor(data.gameLength / 60) +
            ":" + data.gameLength % 60 + " minutes");
    }




}

function getChamp(playerData, id, bot, message) {


    var options = {
        host: 'global.api.pvp.net',
        path: '/api/lol/static-data/na/v1.2/champion/',
        method: 'GET'
    };

    options.path += (searchForSummoner(playerData.participants, id) + "?"); // add name to request
    options.path += ("api_key=" + key); // add appikey

    //console.log('good');
    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            var data = JSON.parse(str);

            formatGameData(playerData, data.name, bot, message);

        });
    }

    https.request(options, callback).end();
}


function searchForSummoner(participants, id) { // ez sequential search, returns champion
    for (var i = 0; i < participants.length; i++) {
        if (participants[i].summonerId == id) {
            return participants[i].championId;
        }
    }
}





process.on('uncaughtException', function(err) {
    console.log(err);
});