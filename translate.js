var Speakable = require('./lib/node-speakable');
var MsTranslator = require('./lib/mstranslator');

var client_secret=process.env.MSCLIENT_SECRET;
var client_id=process.env.MSCLIENT_ID;

if (!client_secret || !client_id) {
  console.log("client_secret and client_id missing");
  process.exit(1);
}

var speakable = new Speakable();
var client = new MsTranslator({client_id: client_id, client_secret: client_secret});

speakable.on('speechStart', function() {
  console.log('onSpeechStart');
});

speakable.on('speechStop', function() {
  console.log('onSpeechStop');
  speakable.recordVoice();
});

speakable.on('speechReady', function() {
  console.log('onSpeechReady');
});

speakable.on('error', function(err) {
  console.log('onError:');
  console.log(err);
  speakable.recordVoice();
});

speakable.on('speechResult', function(spokenWords) {
  console.log('onSpeechResult:');
  var str = spokenWords.join(' ');
  var params = {
    text: str,
    from: 'en',
    to: 'fr'
  };
  console.log(str);
  
  client.initialize_token(function(){
    client.translate(params, function(err, data) {
      if (err) console.log('error:' + err);
      console.log(data);
    });
    client.getLanguagesForTranslate(function(err, data) {
      if (err) console.log('error:' + err);
      console.log(data);
      var options = {
        locale: 'en',
      languageCodes: data
      };
      client.getLanguageNames(options, function(err, data) {
        if (err) console.log('error:' + err);
        console.log(data);
      });
    });
  });
});

speakable.recordVoice();

