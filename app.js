var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });


var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=8974d6fa-1500-46bc-9ac0-f5a1a1c30217&subscription-key=929a376180624437bc881e4501940e3e');
bot.add('/', dialog);

dialog.on('Search', function (session, args) {
console.log(args.entities);
    session.send('Bot version 1.2');
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
