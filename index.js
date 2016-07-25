var restify = require('restify');
var builder = require('botbuilder');
var RiveScript = require('rivescript');

//=========================================================
// Bot Setup
//=========================================================

var riveBot = new RiveScript();

riveBot.loadDirectory("rivescripts", loading_done, loading_error);

function loading_done (batch_num) {
    console.log("Batch #" + batch_num + " has finished loading!");
    riveBot.sortReplies();
}

function loading_error (error) {
    console.log("Error when loading files: " + error);
}

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.appId,
    appPassword: process.env.appSecret
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.on('personalMessage', function(bot, data) {
    var reply = riveBot.reply(data.from, data.content);

    bot.reply('Valasz: ' + reply, true);
    bot.reply(data, true);
});

//bot.dialog('/', function (session) {
//    session.send(".....");
//});
