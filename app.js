var restify = require('restify');
var builder = require('botbuilder');
var amazon = require('amazon-product-api');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });


var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=8974d6fa-1500-46bc-9ac0-f5a1a1c30217&subscription-key=929a376180624437bc881e4501940e3e');
bot.add('/', dialog);

// dialog.on('Search', function (session, args) {
// console.log(args.entities);
// console.log(args.intents);

//     session.send('Thanks! Bot version 1.2');

// });

dialog.on('Search', function (session, args, next) { 
//    console.log(args.entities); 
var productName = builder.EntityRecognizer.findEntity(args.entities, 'ProductName'); 
var color = builder.EntityRecognizer.findEntity(args.entities, 'Color'); 
var brand = builder.EntityRecognizer.findEntity(args.entities, 'Brand'); 
var priceScope = builder.EntityRecognizer.findEntity(args.entities, 'PriceScope'); 
   
var keywords = "";
 if (productName) {(keywords = keywords + productName.entity + " ")};
 if (brand) {(keywords = keywords + brand.entity + " ")};
 if (color) {(keywords = keywords + color.entity + " ")};
 if (priceScope) {(keywords = keywords + priceScope.entity + " ")};

    console.log(keywords);


var client = amazon.createClient({
  awsId: "AKIAIFHM35CBDPNEK6BQ",
  awsSecret: "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",
  awsTag: "shopbot00-20"
});

   var searches = client.itemSearch({
		  keywords: keywords,
		  searchIndex: 'All',
		  responseGroup: 'ItemAttributes,Offers,Images'
		}).then(function(results){
		  console.log(results);
		}).catch(function(err){
		  console.log(err);
		});
 
      session.send( "You asked for " + keywords  ); 
    });

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
