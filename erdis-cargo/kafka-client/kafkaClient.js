'use strict';

var { kafkaErrorLog } = require('./../server/models/kafkaErrorLog');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { mongoose } = require('./../server/db/mongoose');

var kafka = {}
kafka.clientCreated = false;
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = '';
var message = '';

const client1 = new Client('servertr77:2181');

kafka.createClient = async function () {

    return await client1;
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

kafka.messageConsumer = function (topic, partition = 0, autoCommit = true) {
    var topics = [{ topic, partition }];
    var options = { autoCommit, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
    var consumer = new Consumer(client, topics, options);
    var offset = new Offset(client);

    consumer.on('message', function (message) {
        console.log(message);
    });

    consumer.on('error', function (err) {
        console.log('error', err);
    });

}

kafka.messageConsumerOffset = function (topic, partition = 0, offset = 0) {

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
    });
}

kafka.insertErrorLog = function (appId,topicName,errorMessage,errorType,errorTime,moduleName,partition,recordId){
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

kafka.checkTopic = function(topicName){
    kafkaErrorLog.findOne()
    .where(topicName).gt(1)
    .select(topicName)
    .exec(function (err, data) {
        if (err) return handleError(err);
        console.log(data);
    });
}


kafka.messageProducer = function (message) {
    var producer = new Producer(client, { requireAcks: 1 });

    producer.on('ready', function () {
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
}

module.exports = { kafka };




