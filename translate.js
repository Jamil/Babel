var Speakable = require('./lib/node-speakable');
var MsTranslator = require('./lib/mstranslator');

var client_secret=process.env.MSCLIENT_SECRET;
var client_id=process.env.MSCLIENT_ID;
var google_api_key=process.env.GKEY;

if (!client_secret || !client_id) {
  console.log("client_secret and client_id missing");
  process.exit(1);
}

var speakable = new Speakable({key: google_api_key});
var client = new MsTranslator({client_id: client_id, client_secret: client_secret});

speakable.on('speechStart', function() {
  console.log('Speech started');
});

speakable.on('speechStop', function() {
  console.log('Speech stopped... posting data')
  speakable.recordVoice();
});

speakable.on('speechReady', function() {
});

speakable.on('error', function(err) {
  console.log('onError:');
  console.log(err);
  speakable.recordVoice();
});

speakable.on('speechResult', function(spokenWords) {
  
  if (spokenWords.length == 0) {
    console.log('No words detected.');
    return;
  }
  
  var str = spokenWords.join(' ');
  var params = {
    text: str,
    from: 'en',
    to: 'fr'
  };
  
  console.log('Original: ' + str);

  client.initialize_token(function(){
    client.translate(params, function(err, data) {
      if (err) console.log('error:' + err);
      console.log(data);
    });
  });
});

speakable.recordVoice();

