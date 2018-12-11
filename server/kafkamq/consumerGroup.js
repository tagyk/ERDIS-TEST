var async = require('async');
var consumerGroup = require('kafka-node').consumerGroup;

var consumerOptions = {
    host: '127.0.0.1:2181',
    groupId: 'PosTestGroup',
    sessionTimeout: 30000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest'
};

var topics = ['POS'];

var consumerGroup = new consumerGroup(Object.assign({ id: 'consumer1' }, consumerOptions), topics);
consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);

var consumerGroup2 = new consumerGroup(Object.assign({ id: 'consumer2' }, consumerOptions), topics);
consumerGroup2.on('error', onError);
consumerGroup2.on('message', onMessage);

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

function onMessage(message) {
    console.log('%s read msg Topic="%s" Partition=%s Offset=%d', this.client.clientId, message.topic, message.partition, message.offset);
}


process.once('SIGINT', function () {
    async.each([consumerGroup, consumerGroup2], function (consumer, callback) {
        consumer.close(true, callback);
    });
});
