'use strict';

var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = 'ERDISQUEUE2';
var client = new Client('servertr77:2181');
var topics = [{ topic: topic, partition: 0}];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024};

var offset = new Offset(client);
var consumer = new Consumer(client, topics);

try{
    consumer.on('message', function (message) {
        console.log(message);
        var jsonized = JSON.stringify(message);
        var objectValue = JSON.parse(jsonized);
        console.log(objectValue['offset']);
        /*
        if (objectValue['offset'] === objectValue['highWaterOffset']-1) {
            consumer.commit(function (err, data) {
                console.log(objectValue['offset'] + ' commit edildi.');
                consumer.close(true, function (error) {
                    if (error) {
                        console.log("Consuming closed with error", error);
                    } else {
                        let err1 = "ax";
                        console.log("Consuming closed", err1);
                    }
                });                
            });
        }*/
    
        consumer.on('error', function (err) {
            console.log('error', err);
        });
    });

}
catch(error){
    consumer.close(true, function (error) {
        if (error) {
            console.log("Consuming closed with error", error);
        } else {
            console.log("Consuming closed");
        }
    });
}


    /* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset*/
    consumer.on('offsetOutOfRange', function (topic) {
        topic.maxNum = 3;
        offset.fetch([topic], function (err, offsets) {
            if (err) {
                return console.error(err);
            }
            var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
            consumer.setOffset(topic.topic, topic.partition, min);
        });
    });