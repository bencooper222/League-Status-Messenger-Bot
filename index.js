const rito = require('./riot_request.js');
const login = require("facebook-chat-api");

  
login({email: process.env.FACEBOOK_USERNAME, password: process.env.FACEBOOK_PASSWORD}, (err, api) => {
    if(err) return console.error(err);
  
    api.listen((err, message) => {
      let body = message.body;
      console.log(body);
        if(body.match(new RegExp('^@leaguestatus ([^ ]*)')) != null){
           rito(body.substring(14,body.length)).then(data => api.sendMessage(data, message.threadID));
        }
        
    });
});