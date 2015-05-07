var express = require('express');
var request = require('request');
var cheerio = require('cheerio')
var _ = require('lodash');
var app = express();



app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('oh hello world');
});
app.get('/player/:id', function(req, response) {
  var id = parseInt(req.params.id, 10)
  if(isNaN(id) || id < 1) {
    response.send('invalid player id I guess')
  }
  var url = "http://www.transfermarkt.com/cristiano-ronaldo/leistungsdaten/spieler/" + id + "/plus/1?saison=ges"
  request({url: url,
    headers: {
      "User-Agent":  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"
    }
  }, function(err, resp, body) {
    console.log(body)
    var $ = cheerio.load(body)
    var tds = $('tfoot tr td')
    console.log(tds)
    var values = $('tfoot tr td').map(function() {
      return $(this).text()
    }).get();
    var keys = [
      null,
      null,
      "appearances",
      "goals",
      "assists",
      "ownGoals",
      "substitutedOn",
      "substitutedOff",
      "yellowCards",
      "yellow/redCards",
      "redCards",
      "penaltyGoals",
      "minutesPerGoal",
      "minutesPlayed"
    ]
    var dataObject = {};
    _.each(keys, function(key, keyIndex) {
      if(key === null) return
      dataObject[key] = values[keyIndex]
    })
    response.set('Content-type', 'text/plain')
    response.send(JSON.stringify(dataObject))

  })
})
app.get('/player', function(req, response) {
  response.send('provide a player id')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
