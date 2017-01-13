var key = 'b8d61b09-33c2-4b82-b0ea-a06e785e7bb8';


/*fs.readFile('apiKey.txt', 'utf8', function(err, data) {

    key = data;
    console.log(key);
});
*/


function requestSummonerId(summonerName, matchMethod) {

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
            matchMethod(data[summonerName.toLowerCase()].id);

        });
    }

    https.request(options, callback).end();
}


var findMatch = function(id) {

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
            processGameData(data, id)

        });
    }

    https.request(options, callback).end();
}

function processGameData(data, id) {
    if (Object.keys(data)[0] == "status") {
        console.log("Summoner not playing");
    } else {
        //console.log(data);
        console.log(getChamp(data, id));
    }
}

function formatGameData(data, champ) {
    console.log("They are in game and have been playing " + champ + " for " + Math.floor(data.gameLength / 60) +
        ":" + data.gameLength % 60);
    return "They are in game and have been playing " + champ + " for " + Math.floor(data.gameLength / 60) +
        ":" + data.gameLength % 60 + "minutes:seconds"
}

function getChamp(playerData, id) {


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

            formatGameData(playerData, data.name);

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