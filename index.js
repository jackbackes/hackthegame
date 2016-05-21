var wdio = require('webdriverio');
var $ = require('jquery');
var fs = require('fs');
var readline = require('readline');

var un = process.argv[2];
var pass = process.argv[3];

var appOptions = cliArgs();
/*
command line arguments that can be used:
  [-f username pass]
  [-b relativeBotPath]
*/
function cliArgs(){
  var args = process.argv;
  var appOptions = {
    facebookLogin: args.indexOf("--f") !== -1 ? args.splice( args.indexOf("--f"), 3 ) : undefined,
    botPaths: args.indexOf("--b") !== -1 ? [args[args.indexOf("--b")+1]] : undefined
  }
  return appOptions;
}


console.log(appOptions);

var webDriverOptions = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};
var botsToTest = appOptions.botPaths || ['./bots/testbot.js']
var botData = botsToTest.map( bot => fs.readFileSync(bot, 'utf8') );

var client = wdio.remote(webDriverOptions).init();


client.addCommand("loginToFacebook", function async (email, pass, callbackUrl, socialLoginSelector, appOptions) {
  if(!!appOptions.facebookLogin){email = appOptions.facebookLogin[1]; pass = appOptions.facebookLogin[2];}
  if(!email || !pass ) throw 'must provide email and password';
  if(!callbackUrl || !socialLoginSelector) throw 'must provide callback url and social login selector'
  var self = this;
  return self.url('https://www.facebook.com')
    .click('#login_form #email')
    .keys(email.split(''))
    .click('#login_form #pass')
    .keys(pass.split(''))
    .click('#loginbutton input')
    .call(function(){
      return self
        .url(callbackUrl)
        .click(socialLoginSelector)
        .pause(2000)
    })
  })
client.addCommand("loadGame", function async (gameId){
    gameId = gameId || 69;
    var puzzleSelector = '.puzzle-'+gameId;
    var self = this;
    return self
      .url('https://www.codingame.com/games/multi')
      .then(function(result){
        client.execute("$('#chat').hide()", "")
        return result
      })
      .click(puzzleSelector + ' .puzzle-solve-button')
  })
client.addCommand('shutDownSession', function(){
    return this.pause(5000).window().end()
  })
client.addCommand('selectContentWindow', function(){
  var self = this;
  return self.waitForExist('textarea.ace_text-input', 10000).then(function(result){
    console.log(result);
    return self.pause(1000).click('.ace_scroller');;
  })
})
client.addCommand('selectAll', function(){
  var self=this;
  return self.pause(1000).keys(['Command','a','Command']);
})
client.addCommand('clearBot', function(){
  var self = this;
  // return self.pause(1000).keys(['Delete']);
  return self.pause(3000).execute("angular.element('.code-editor').scope().code=''")
})

client.addCommand('injectBot', function(botText, appOptions){
  var self = this;
  return self.pause(3000).call(function(){
    botText = botText.split('\"').join('\\\"').split('\n').join('\\ \\n');
    var code = {
      raw:"angular.element('.code-editor').scope().code="+botText
    }
    return self.execute(String.raw`angular.element('.code-editor').scope().code="${botText}"`);
  }).then(function(){
    console.log('injected bot');
    return self;
  })
})

//to do:
client.addCommand('testBot',function(){
  var self = this;
  return self.click('.actions-bloc button.play');
});
client.addCommand('submitBot',function(){
  var self = this;
  return self.click('.actions-bloc button.submit');
});


//COMMANDS IN PROGRESS:

// client.addCommand('getResultsOfGame',function(){
//   var gameObj = {};
//   var code = $("div.cg-ide-mini-leaderboard")
//                 .find('.details div')
//                 .contents()
//                 .each(function(i, current){
//                   gameObj[current.data] = {}
//                 });
//   Object.keys(gameObj).forEach( function(player){
//     gameObj[player] = window.$("div.frame-players:contains("+player+")").map( function(index, current){ return window.$(current).find("pre.std-out div.outputLine, pre, .frame-number, .frame-count" ) } ) } );
// });
// client.addCommand('goToNextGame',function(){});
// client.addCommand('iterateAllGames',function(){});

//command chain:
client
    .loginToFacebook( un, pass, 'https://www.codingame.com/signin', '.social-connect-button-facebook', appOptions)
    .loadGame(69)
    // // .selectContentWindow()
    // // .selectAll()
    .clearBot()
    .injectBot(botData[0])
    // // .injectBot('./bots/testbot.js')
    // // .shutDownSession()
    .catch(function(err){console.log(err)})
