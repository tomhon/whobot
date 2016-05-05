var restify = require('restify');
var builder = require('botbuilder');
var amazon = require('amazon-product-api');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'My3rdBot', appSecret: '77fb019861b849fe9f5c584920bff461' });

// Connect to LUIS application
var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=8974d6fa-1500-46bc-9ac0-f5a1a1c30217&subscription-key=929a376180624437bc881e4501940e3e');
bot.add('/', dialog);

// });

//handle the case where there's no recognized intent

dialog.on('None', function (session, args, next) { 
    session.send( "Welcome to Shoppingly on Bot Framework. What would you like to shop for? " ); 
    });
    
//handle the case where intent is happy

dialog.on('Happy', function (session, args, next) { 
    session.send( "Hope you enjoyed this as much as i did:-) " ); 
    });
    
//handle the case where intent is sad

dialog.on('Sad', function (session, args, next) { 
    session.send( "Life? Don't talk to me about life. Did you know I've got this terrible pain in all the diodes down my left side? " ); 
    });    

//handle the Search intent

dialog.on('Search', function (session, args, next) { 
//    console.log(args.entities); 

// use bot builder EntityRecognizer to parse out the LUIS entities
var productName = builder.EntityRecognizer.findEntity(args.entities, 'ProductName'); 
var color = builder.EntityRecognizer.findEntity(args.entities, 'Color'); 
var brand = builder.EntityRecognizer.findEntity(args.entities, 'Brand'); 
var priceScope = builder.EntityRecognizer.findEntity(args.entities, 'PriceScope'); 

// assemble the query using identified entities   
var keywords = "";
 if (color) {(keywords = keywords + color.entity + " ")};
 if (productName) {(keywords = keywords + productName.entity + " ")};
 if (brand) {(keywords = keywords + brand.entity + " ")};
 if (priceScope) {(keywords = keywords + priceScope.entity + " ")};

    console.log(keywords);

// connect to Amazon shopping API using Azure Application Settings

var client = amazon.createClient({
  awsId: process.env.AWSID,
  awsSecret: process.env.AWSSECRET,
  awsTag: process.env.AWSTAG
});

var results;

   var searches = client.itemSearch({
		  keywords: keywords,
		  searchIndex: 'All',
		  responseGroup: 'ItemAttributes,Offers,Images'
		}).then(function(searchResults){
		  results = searchResults;
//     console.log(results);
//parse results and build response message 
      var attribution = results[0].ItemAttributes[0].Title[0];
      var imageLink = results[0].LargeImage[0].URL[0];
// console.log[imageLink];
    var reply = new builder.Message()
                               .setText(session, attribution)
                               .addAttachment({ fallbackText: attribution, contentType: 'image/jpeg', contentUrl: imageLink 
                               });
// return results to client
      session.send( "You asked for " + keywords ); 
      session.endDialog(reply);
      
		}).catch(function(err){
		  console.log(err);
		});
      
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
