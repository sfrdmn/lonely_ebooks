var _ = require('underscore');
var http = require('http');
var vowels = 'aeiou';
var consonants = 'bcdfghjklmnpqrstvwxyz';

var options = {
  host: 'localhost',
  port: 5984,
  path: '/words'
};

var post = _.extend({}, options);
post.method = 'PUT';

var get = _.extend({}, options);
get.method = 'GET';

var entries = 1000;
var wordMin = '3';
var wordMax = '11';
_.each(_.range(entries), function(i) {
  var requestOptions = _.extend({}, post);
  var word = '';
  _.each(_.range(getRandomInt(wordMin, wordMax)), function(j) {
    if (j % 2 === 0) {
      word += vowels.charAt(getRandomInt(0, vowels.length - 1));
    } else {
      word += consonants.charAt(getRandomInt(0, consonants.length - 1));
    }
  });
  //console.log(word, i);
  requestOptions.path += '/' + word;
  var request = http.request(requestOptions, function(res) {
    console.log(res.statusCode);
  });
  request.on('error', function(e) {
    console.log('Error: ' + e.message);
  });
  request.write(JSON.stringify({content: word}));
  request.end();
  //console.log(JSON.stringify(requestOptions), JSON.stringify(post));
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
