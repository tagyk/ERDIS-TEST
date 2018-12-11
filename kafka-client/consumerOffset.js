var { kafkaTopicConf } = require('./../server/models/kafkaTopicConf');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { mongoose } = require('./../server/db/mongoose');

var kafka = require('kafka-node')
/*   Consumer = kafka.Consumer,
   client = new kafka.Client("servertr77:2181/"),
   consumer = new Consumer(
       client,
       [
           { topic: 'ERDIS4QUEUE', partition: 0, offset: 200 }
       ],
       { fromOffset: true }
   );

consumer.on('message', function (message) {
   console.log(message);

});

consumer.on('error', function (err) {
   console.log('ERROR: ' + err.toString());
   new kafkaErrorLog({
       appId: 'LF',
       topicName: 'ERDISQUEUE',
       errorMessage: 'ERROR: ' + err.toString(),
       errorType: '1234'
   }).save().then((temp) => {
       topic = temp.topicName;
       console.log(topic);
   });

});*/


kafkaTopicConf.findOne()
    .where('topicName').gt('ERDISQUEUE')
    .select('topicName')
    .exec(function (err, data) {
        if (err) return handleError(err);
        console.log(data);
    });

kafkaTopicConf.find({}, function (err, docs) {
    console.log(JSON.stringify(docs));
    console.log('%s', docs);
});











