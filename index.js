var irc = require('irc');
var config = require('./libs/config');
var Forecast = require('forecast');
var geocoder = require('geocoder')

// Connect to Forecase
var forecast = new Forecast(
    { service: 'forecast.io'
    , key: config.forecast.apiKey
    , units: 'f'
    , cache: true
    , ttl:
        { minutes: 10
        }
    }    
)


// Create Bot
var bot = new irc.Client('chat.freenode.net', 'HakrBot', 
    { channels: ['#hakrlabs']
    , port: 6667
    }
)

bot.addListener('message', function(from, to, message){
    var og = message;
    message = message.toLowerCase()
    console.log(from + ' => ' + to + ': ' + message)
    if(message.indexOf('hello hakrbot') != -1){
        console.log('I\'m going to say something')
        bot.say(to, 'Hello ' + from)
    }
    if(message.indexOf('at the lab') != -1){
        bot.say(to, 'Based on login time. There are ~4 members at the lab.')
    }
    if(message.indexOf('last member') != -1){
        bot.say(to, 'Last member to come to the lab was a user')
    }
    if(message.indexOf('!w') != -1){
        message = message.split(' ');
        message.shift();
        var place = message[0];
        forecast.get(place, function(err, weather){
            if(err){
                bot.say(to, 'There was an error checking for the weather....' + err)
            } else {
                geocoder.geocode(place, function(err, data){
                    var loc;
                    if(err)
                        loc = place
                    else
                        loc = data.results[0].formatted_address
                    console.log(loc)
                    bot.say(to, 'The temp in ' + loc + ' is ' + weather.currently.temperature)
                })
            }
        })
    }
    if(message.indexOf('!alarm') != -1){
        message = message.split(' ');
        message.shift();
        var time = message[0];
        message.shift();
        var msg = message.join(' ');
        bot.say(to, 'An alarm is set for ' + time + ' with the message: ' + msg)
    }
})

bot.addListener('error', function(message){
    console.log('error: ', message)
})
