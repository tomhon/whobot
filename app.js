"use strict";

// Cloned & branched from my3rdbot

var restify = require('restify');
var builder = require('botbuilder');
// var amazon = require('amazon-product-api');

//add appInsights
// import appInsights = require("applicationinsights");
// appInsights.setup("<instrumentation_key>").start();


//Connect to SQL Server
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES; 
var Connection = require('tedious').Connection;

//initialize mapping data array

//partnerISV is locally sourced mapping data for testing
var partnerISV = new Array(5);

//arrayIsvTE is sourced from SQL Server
var arrayIsvTE = new Array();
// arrayIsvTE.push("First item on mapping array");

//error array
var arrayErr = new Array();


partnerISV[0]= new Array(2);
partnerISV[0][0] = 'Snapchat'.toLowerCase();
partnerISV[0][1] = 'James Cadd <jacadd@microsoft.com>';
partnerISV[1]= new Array(2);
partnerISV[1][0] = 'Twitter'.toLowerCase();
partnerISV[1][1] = 'Chris Barker <cbarker@microsoft.com>';
partnerISV[2]= new Array(2);
partnerISV[2][0] = 'Yahoo'.toLowerCase();
partnerISV[2][1] = 'Maarten van de Bospoort <maartenb@microsoft.com>';
partnerISV[3]= new Array(2);
partnerISV[3][0] = 'baidu'.toLowerCase();
partnerISV[3][1] = 'Yansong Li <yansongl@microsoft.com>';


//set up SQL server connection

var config = {
        userName: process.env.SQLuserName,
        password: process.env.SQLpassword,
        server: process.env.SQLserver,
        // If you are on Microsoft Azure, you need this:
        options: {encrypt: true, database: process.env.SQLdatabase}
    };

var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    
        if (err) {
           console.log(err);
            arrayErr.push(err);
        } else {
          console.log("Connected to " + this.config.server + " " + this.config.options.database);
          arrayErr.push("Connected to SQL Server");
        //   loadMappingArray();    
        };
        
        
    });
 
 //function to execute SQL query    
    
 function loadMappingArray() {
      // request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {
        arrayErr.push("entered loadMappingArray");
        // request = new Request("SELECT Title, AssignedTE FROM dbo.PartnerIsvs", function(err) {
        // request = new Request("SELECT PartnerName, TEName FROM dbo.partners", function(err) {
        // if (err) {
        //     console.log(err);
        //     arrayErr.push("SQL request failed");
        //   } else {
        //     arrayErr.push("SQL request succeeded");
        //   }
        // });


        // result = "";
        // request.on('row', function(columns) {
        //     columns.forEach(function(column) {
        //       if (column.value === null) {
        //         console.log('NULL');
        //       } else {
        //         result+= column.value + " ";
        //       }
        //     });
        //     console.log(result);
        //     arrayIsvTE.push(result);
        //     result ="";
        // }); 
        
        // request.on('done', function(rowCount, more) {
        // console.log(rowCount + ' rows returned');
        // });
        
        // connection.execSql(request);
    };

// Create bot and add dialogs
// setTimeout(function() {
    var bot = new builder.BotConnectorBot({ appId: process.env.AppID, appSecret: process.env.AppSecret });
// },5000);

// Connect to LUIS application
var dialog = new builder.LuisDialog(process.env.LUISServiceURL);
bot.add('/', dialog);

// });

//handle the case where there's no recognized intent

dialog.on('None', function (session, args, next) { 
    session.send( "Master! Welcome to K9 on Microsoft Bot Framework. I can tell you which TE or BE manages any GISV partner." ); 
    session.send( "Local Partner data is live = " + (partnerISV.length > 0)); 
    session.send( "Remote Partner data is live = " + arrayErr[0]); 
    session.send( "Remote Partner data is live = " + arrayErr[1]); 
    // session.endDialog("Session Ended");
    });
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is happy

dialog.on('Happy', function (session, args, next) { 
    session.send( "Hope you enjoyed this as much as i did:-) " ); 
        //   session.endDialog("Session Ended");
    });
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is sad

dialog.on('Sad', function (session, args, next) { 
    session.send( "Life? Don't talk to me about life. Did you know I've got this terrible pain in all the diodes down my left side? " );
        //   session.endDialog("Session Ended"); 
    });    
//---------------------------------------------------------------------------------------------------    
//handle the case where intent is abuse

dialog.on('Abuse', function (session, args, next) { 
    session.send( "Hey, don't be mean to me:-) " ); 
        //   session.endDialog("Session Ended");
    });   

//---------------------------------------------------------------------------------------------------
//handle the Find Technical Evangelist Find_TE intent

dialog.on('Find_TE', function (session, args, next) { 
//    console.log(args.entities); 

// use bot builder EntityRecognizer to parse out the LUIS entities
var account = builder.EntityRecognizer.findEntity(args.entities, 'Account'); 

// assemble the query using identified entities   
var searchAccount = "";

if (account) {(searchAccount = account.entity)};

session.send( "Looking for the TE for " + searchAccount); 
// session.send( "in partnerISV array length" + partnerISV.length); 
var x = 0;

// // console.log("Looking for account");
while ( x < partnerISV.length) {
    // session.send(partnerISV[x][0]); 
    if (partnerISV[x][0] == searchAccount) {
//         // console.log(partnerISV[x][0] +" " + partnerISV[x][1]);
//         //post results to chat
        session.send( "The TE for " + searchAccount + " is " + partnerISV[x][1]); 
        x = partnerISV.length;
    };
    x++;
    };




    // console.log(keywords);
      session.endDialog("Session Ended");
      
     
      
      
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
