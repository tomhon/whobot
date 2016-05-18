"use strict";

// Cloned & branched from my3rdbot

var restify = require('restify');
var builder = require('botbuilder');
// var amazon = require('amazon-product-api');

//add appInsights
// import appInsights = require("applicationinsights");
// appInsights.setup("<instrumentation_key>").start();


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
 if (account) {(keywords = keywords + account.entity + " ")};

// build SQL request

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES; 
var Connection = require('tedious').Connection;
var config = {
        userName: process.env.SQLuserName,
        password: process.env.SQLpassword,
        server: process.env.SQLserver,
        // If you are on Microsoft Azure, you need this:
        options: {encrypt: true, database: process.env.SQLdatabase}
    };

      session.send( "Line 73 - The TE for " + keywords + "is " + config.server); 

var connection = new Connection(config);
    
    connection.on('connect', function(err) {
    // If no error, then good to proceed.
        if (err) {
           console.log(err);
        } else {
          console.log("Connected to " + this.config.server + " " + this.config.options.database);      
          bot.session.send("Connected to " + this.config.server);
        };
        

        
    });
    
//function to execute SQL query    
    
        function executeAccountQuery(account) {
      // request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {
        console.log(account);
        var queryStatement = "SELECT Title, AssignedTE FROM dbo.PartnerIsvs WHERE Title LIKE '" + account +"%'";
        console.log(queryStatement.trim());
        request = new Request(queryStatement.trim(), function(err) {
        if (err) {
            console.log(err);
          }
        });

        

        var result = "";
        request.on('row', function(columns) {
            columns.forEach(function(column) {
              if (column.value === null) {
                console.log('NULL');
              } else {
                result+= column.value + " ";
              }
            });
            console.log(result);
            bot.session.send(result);
            result ="";
        });

        request.on('done', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
        });
        connection.execSql(request);
    }

//post results to chat

    // console.log(keywords);
    //   session.send( "The TE for " + keywords + "is " ); 
      executeAccountQuery('Hulu');
      session.endDialog();
      
     
      
      
// connect to Amazon shopping API using Azure Application Settings

// var client = amazon.createClient({
//   awsId: process.env.AWSID,
//   awsSecret: process.env.AWSSECRET,
//   awsTag: process.env.AWSTAG
// });

// var results;

//    var searches = client.itemSearch({
// 		  keywords: keywords,
// 		  searchIndex: 'All',
// 		  responseGroup: 'ItemAttributes,Offers,Images'
// 		}).then(function(searchResults){
// 		  results = searchResults;
// //     console.log(results);

// //parse results and build response message 
//       var attribution = results[0].ItemAttributes[0].Title[0];
//       var imageLink = results[0].LargeImage[0].URL[0];
// // console.log[imageLink];
//     var reply = new builder.Message()
//                                .setText(session, attribution)
//                                .addAttachment({ fallbackText: attribution, contentType: 'image/jpeg', contentUrl: imageLink 
//                                });
// // return results to client
//       session.send( "You asked for " + keywords ); 
//       session.endDialog(reply);
      
// 		}).catch(function(err){
// 		  console.log(err);
// 		});
      
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

// Find BE for account







      
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
