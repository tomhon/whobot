var restify = require('restify');
var builder = require('botbuilder');
var amazon = require('amazon-product-api');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'My3rdBot', appSecret: '77fb019861b849fe9f5c584920bff461' });


var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=8974d6fa-1500-46bc-9ac0-f5a1a1c30217&subscription-key=929a376180624437bc881e4501940e3e');
bot.add('/', dialog);

// dialog.on('Search', function (session, args) {
// console.log(args.entities);
// console.log(args.intents);

//     session.send('Thanks! Bot version 1.2');

// });

dialog.on('None', function (session, args, next) { 
    session.send( "What would you like to shop for? " ); 
    });

dialog.on('Search', function (session, args, next) { 
//    console.log(args.entities); 
var productName = builder.EntityRecognizer.findEntity(args.entities, 'ProductName'); 
var color = builder.EntityRecognizer.findEntity(args.entities, 'Color'); 
var brand = builder.EntityRecognizer.findEntity(args.entities, 'Brand'); 
var priceScope = builder.EntityRecognizer.findEntity(args.entities, 'PriceScope'); 
   
var keywords = "";
 if (color) {(keywords = keywords + color.entity + " ")};
 if (productName) {(keywords = keywords + productName.entity + " ")};
 if (brand) {(keywords = keywords + brand.entity + " ")};
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
 
    var attribution = "RobotsMODO By AlejandroLinaresGarcia (Own work) [CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0)], via Wikimedia Commons";
    var imageLink = 'https://upload.wikimedia.org/wikipedia/commons/d/df/RobotsMODO.jpg';
    var reply = new builder.Message()
                               .setText(session, attribution)
                               .addAttachment({ fallbackText: attribution, contentType: 'image/jpeg', contentUrl: imageLink 
                               });

 
      session.send( "You asked for " + keywords ); 
      session.endDialog(reply);
      
    });

// Setup Restify Server
var server = restify.createServer();
server.get('/', function (req, res) {
    res.send('Running');
});
// server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.post('/api/messages', bot.listen());
server.listen(process.env.port || 80, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
