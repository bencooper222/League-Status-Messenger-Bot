# League Status Bot

## Getting started

Fill out the .env file with the appropriate info:

```
FACEBOOK_USERNAME=
FACEBOOK_PASSWORD=
RIOT_API_KEY=
LEAGUE_API_PLATFORM_ID=
```

```bash
npm install //you know the drill

npm start
```

## Notes
The biggest issue is that `champions.json` does not auto-update because the Riot Static API is limited to 10 calls/hour. Each time a new champ is added, the list must be updated.

## License
MIT License