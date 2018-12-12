var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var client = new Client('servertr77:2181');
var argv = require('optimist').argv;
var topic =  'ERDISQUEUE';
var p = argv.p || 0;
var a = argv.a || 0;
var producer = new Producer(client, { requireAcks: 1 });

producer.on('ready', function () {
  var message = 'this is a message';
  var keyedMessage = new KeyedMessage('5keyed', 'This is a Keyed message of lafla');

  producer.send([
    { topic: topic, partition: p, messages: [message, keyedMessage], attributes: a }
  ], function (err, result) {
    console.log(err || result);
    process.exit();
  });
  
});

producer.on('error', function (err) {
  console.log('error', err);
});
