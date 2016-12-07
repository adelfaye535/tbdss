
'use strict';

var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/tbdss';

var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY = 'ZfrsSelkQphcjBMScxBWq6KZ4',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET = 'BK0AryrvmFRVuP3LqRWgw4sfKv0ztWRrKekGEcaIBn7ZmgxKza',
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY = '722055410828455936-E0VaaCI50iNobXDrO7ujkPhc1FPhwxR',
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET = 'dVOGAgstv1rHgSXupPcCUCXgVitqfnqRXIbtUog5ElKWd'
});

app.use(express.static(__dirname + '/public'));
// app.get('/heatmap',function(req,res){
//   res.sendFile('/index2.html');
// });

app.set('port', (process.env.PORT || 3000));

mongo.connect(mongoURI, function(err, db) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB...\n');
  }

  var col = db.collection('tweets');

   // var keywords = ;
  client.stream('statuses/filter', {
    tracks:('dengue', 'denguehilanat','denguefever','denguelagnat', 'headache','eyepain','musclepain','taasnahilanat','labadangulo','balikbaliknahilanat'),
    locations:'122,13,123,14'}, function(stream) {    //start twitter data stream
    // client.stream('statuses/filter', {locations:'122,13,123,14'}, function(stream) {
    console.log("Twitter stream has started...\n");

    stream.on('data', function(tweet) { //start twitter DATA
      console.log('searching for data...');
      if (tweet.geo && (tweet.text.toLowerCase().indexOf('#hire') < 0 ) && (tweet.text.toLowerCase().indexOf('#hiring') < 0 ) && (tweet.text.toLowerCase().indexOf('#job') < 0)) {
        var curTime = new Date();
        var newTweet = {
          curDate: new Date().toISOString(),
          text: tweet.text,
          latitude: tweet.geo.coordinates[0],
          longitude: tweet.geo.coordinates[1]
        };
        col.insert(newTweet);    //save new tweet to db
        io.emit('newTweet', newTweet);    //send new tweet to front end
        console.log('\nNew tweet: ' + tweet.text + '\n[' + tweet.geo.coordinates[0], tweet.geo.coordinates[1] + ']\n');
      }
    }); //end twitter DATA

    io.on('connection', function(socket) {   //open socket when user connects
      console.log('A new user has connected!\n');
      col.find().sort({curDate: -1}).limit(500).toArray(function(err, result) {
        if (err) {
          console.log(err);
        }
        io.emit('output', result);
      });

      socket.on('disconnect', function () {
        console.log('User disconnected!\n');
      });
    }); //end socket connection
  }); //end twitter stream
}); //end mongo connection    


http.listen(app.get('port'), function() {
  console.log('\nServer is now running on port ' + app.get('port') + '...\n');
});

