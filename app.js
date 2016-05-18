// Cloned & branched from my3rdbot

var restify = require('restify');
var builder = require('botbuilder');
var amazon = require('amazon-product-api');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: process.env.AppID, appSecret: process.env.AppSecret });

// Connect to LUIS application
var dialog = new builder.LuisDialog(process.env.LUISServiceURL);
bot.add('/', dialog);

// });

//handle the case where there's no recognized intent

dialog.on('None', function (session, args, next) { 
    session.send( "Master! Welcome to K9 on Microsoft Bot Framework. I can tell you which TE or BE manages any GISV partner." ); 
    });
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is happy

dialog.on('Happy', function (session, args, next) { 
    session.send( "Hope you enjoyed this as much as i did:-) " ); 
    });
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is sad

dialog.on('Sad', function (session, args, next) { 
    session.send( "Life? Don't talk to me about life. Did you know I've got this terrible pain in all the diodes down my left side? " ); 
    });    
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is abuse

dialog.on('Abuse', function (session, args, next) { 
    session.send( "No, just because we're both using Microsft's AI doesn't mean I'm into racist abuse:-) " ); 
    });   

//---------------------------------------------------------------------------------------------------
//handle the Find Technical Evangelist Find_TE intent

dialog.on('Find_TE', function (session, args, next) { 
//    console.log(args.entities); 

// use bot builder EntityRecognizer to parse out the LUIS entities
var account = builder.EntityRecognizer.findEntity(args.entities, 'Account'); 

// assemble the query using identified entities   
var keywords = "";
 if (account) {(keywords = keywords +account.entity + " ")};


    console.log(keywords);
      session.send( "The TE for " + keywords + " is "); 
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
//---------------------------------------------------------------------------------------------------
//handle the Find Business Evangelist Find_BE intent

dialog.on('Find_BE', function (session, args, next) { 
//    console.log(args.entities); 

// use bot builder EntityRecognizer to parse out the LUIS entities
var account = builder.EntityRecognizer.findEntity(args.entities, 'Account'); 

// assemble the query using identified entities   
var keywords = "";
 if (account) {(keywords = keywords +account.entity + " ")};


    console.log(keywords);
      session.send( "The BE for " + keywords + " is "); 
// connect to Amazon shopping API using Azure Application Settings







      
    });

//---------------------------------------------------------------------------------------------------
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
