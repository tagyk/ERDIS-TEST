'use strict';

var kafka = require('kafka-node');
var Client = kafka.Client;
var Offset = kafka.Offset;
var offset = new Offset(new Client());
var topic = 'ERDISQUEUE';

// Fetch available offsets
offset.fetch([
    { topic: topic, partition: 0, maxNum: 2 },
    { topic: topic, partition: 1 }
], function (err, offsets) {
    console.log(err || offsets);
});

// Fetch commited offset
offset.commit('PosTestGroup', [
    { topic: topic, partition: 0, offset: 127 }
], function (err, result) {
    console.log(err || result);
});
