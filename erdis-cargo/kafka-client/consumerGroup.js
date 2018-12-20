var async = require('async');
var kafka = require('kafka-node');
const consumerGroup = kafka.ConsumerGroup;
var consumerOptions = {
    host: 'servertr77:2181',
    groupId: 'PosTestGroup',
    sessionTimeout: 30000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' //'none', 'latest', 'earliest'
};

var topics = ['ERDISQUEUE'];


var consumerGroupN = new consumerGroup(Object.assign({ id: 'consumerAPOS' }, consumerOptions), topics);
consumerGroupN.on('error', onError);
consumerGroupN.on('message', onMessage);

var consumerGroup2 = new consumerGroup(Object.assign({ id: 'consumerESCM' }, consumerOptions), topics);
consumerGroup2.on('error', onError);
consumerGroup2.on('message', onMessage);
consumerGroup2.on('connect', function () {
    setTimeout(function () {
        consumerGroup2.close(true, function (error) {
            console.log('consumerESCM closed', error);
        });
    }, 50000);
});

var consumerGroup3 = new consumerGroup(Object.assign({ id: 'consumerOther' }, consumerOptions), topics);
consumerGroup3.on('error', onError);
consumerGroup3.on('message', onMessage);
consumerGroup3.on('connect', function () {
    setTimeout(function () {
        consumerGroup3.close(true, function (error) {
            console.log('consumerOther closed', error);
        });
    }, 25000);
});

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

function onMessage(message) {
    console.log('%s read msg Topic="%s" Partition=%s Offset=%d', this.client.clientId, message.topic, message.partition, message.offset);
}


process.once('SIGINT', function () {
    async.each([consumerGroupN, consumerGroup2, consumerGroup3], function (consumer, callback) {
        consumer.close(true, callback);
    });
});
