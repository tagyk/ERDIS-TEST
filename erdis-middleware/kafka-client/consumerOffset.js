var { kafkaTopic } = require('./../server/models/kafkaTopic');
const _ = require('lodash');
var { mongoose } = require('./../server/db/mongoose');

var kafka = require('kafka-node')
Consumer = kafka.Consumer,
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

});


/*kafkaTopicConf.findOne({ topicName: 'ERDISQUEUE' }).then((result) => {
    topic = result.topicName;
    console.log(topic);
});*/


/*
new kafkaTopic({
    appId: 'CL1',
    topicName: 'ERDISQUEUE',
    description: 'Test1',
    module: 'POS',
    partition: 1
}).save().then((temp) => {
    console.log(temp);
});*/


kafkaTopic.findOne({}, function (err, result) {

    let topic = result.topicName;
    // console.log(result);
}).then((topic) => {
    if (topic) {
        return true;
    }
    else false;
});












