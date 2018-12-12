'use strict';

var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
//var argv = require('optimist').argv;
var topic = 'BARCODEQUEUE';
var client = new Client('servertr77:2181');
var topics = [{ topic: topic }];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, group:'consumerpos',  fetchMaxBytes: 1024 * 1024 };
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function (message) {
  console.log(message);
});

consumer.on('error', function (err) {
  console.log('error', err);
});
