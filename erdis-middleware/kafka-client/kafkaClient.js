'use strict';

var { kafkaErrorLog } = require('./../server/models/kafkaErrorLog');
// const express = require('express');
// const bodyParser = require('body-parser');
// const { ObjectID } = require('mongodb');

var { kafkaTopic } = require('./../server/models/kafkaTopic');

var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Producer = kafka.Producer;
var Offset = kafka.Offset;
var client = kafka.Client;
var topic = kafka.Topic;


//const client1 = new Client('servertr77:2181');

kafka.createClient = function () {

    let client1 = new client('servertr77:2181');
    return client1;
};

kafka.newClient = function () {

    return new Promise(function (resolve, reject) {
        if (!kafka.clientCreated) {
            kafka.createClient()
                .then(function (result) {
                    kafka.clientCreated = true;
                    resolve(result);
                });
        }
        else {
            resolve(client1.then(function (value) {
                return (value);
            }));
        }
    });
};

kafka.messageConsumer = function (client = kafka.createClient(), topic, partition = 0, autoCommit = false, cb) {

    var topics = [{ topic, partition }];
    var options = { autoCommit: autoCommit, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
    var consumer = new Consumer(client, topics, options);
    var offset = new Offset(client);
    let dataValues = [];

    consumer.on('message', function (message) {
        
        var jsonized = JSON.stringify(message);
        var objectValue = JSON.parse(jsonized);

        if (objectValue['offset'] === objectValue['highWaterOffset'] - 1) {

            consumer.close(true, function (err, message) {
                cb(dataValues);
            });

        }

        dataValues = dataValues.concat(message)

    });

    consumer.on('error', function (err) {
        console.log('error', err);
        consumer.close(true, function (err) {
            console.log('Consumer closed-', err);
            process.exit();
        });
    });

}

kafka.messageConsumerOffset = function (client, topic, partition = 0, offset = 0) {

    consumer = new Consumer(
        client,
        [
            { topic: topic, partition: partition, offset: offset }
        ],
        { fromOffset: true }
    );

    consumer.on('message', function (message) {
        console.log(message);
        return message;
    });

    consumer.on('error', function (err) {
        console.log('ERROR: ' + err.toString());
        new kafkaErrorLog({
            appId: '',
            topicName: topic,
            errorMessage: 'ERROR: ' + err.toString(),
            errorType: 'KafkaError',
            errorTime: Date.now(),
            moduleName: '',
            partition: partition,
            recordId: ''
        }).save().then((temp) => {
            topic = temp.topicName;
            console.log(topic);
        });
        consumer.close(true, function (err) {
            return ('Consumer closed-', err);
        });

    });
}

kafka.insertErrorLog = function (appId, topicName, errorMessage, errorType, errorTime, moduleName, partition, recordId) {
    new kafkaErrorLog({
        appId: appId,
        topicName: topicName,
        errorMessage: errorMessage,
        errorType: errorType,
        errorTime: errorTime,
        moduleName: moduleName,
        partition: partition,
        recordId: recordId
    }).save().then((temp) => {
        topic = temp.topicName;
        console.log(topic);
    });
}

kafka.checkTopic = function (topicName) {

    kafkaTopic.findOne({}, function (err, result) {
        let topic = result.topicName;
    }).then((topic) => {
        if (topic) return true;
        else return false;
    });
}


kafka.createNewTopic = async function (client, appId, topicName, description = '', module, partition) {
    await new kafkaTopic({
        appId: appId,
        topicName: topicName,
        description: description,
        module: module,
        partition: partition
    }).save().then((temp) => {
        console.log(temp);
    });

    var topics = await [{
        topic: topicName,
        partitions: partition
    }];

    await client.createTopics(topics, (error, result) => {
        // result is an array of any errors if a given topic could not be created 
    });
    process.exit();
}


kafka.messageProducer = function (client, message, topic, partition) {
    var producer = new Producer(client, { requireAcks: 1 });

    producer.on('ready', function () {
        producer.send([
            { topic: topic, partition: partition, messages: [message], attributes: 0, timestamp: Date.now() }
        ], function (err, result) {
            console.log(err || result);
            process.exit();
        });

    });

    producer.on('error', function (err) {
        console.log('error', err);
        process.exit();
    });
}

module.exports = { kafka };






