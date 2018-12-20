const mongoose = require('mongoose');
const {conn} = require('./../db/mongoose-erdis-config');

var kafkaTopicSchema = new mongoose.Schema({
    appId: {
        type: String
    },
    topicName: {
        type: String
    },
    description: {
        type: String
    },
    module: {
        type: String
    },
    partition: {
        type: String
    }
});

var kafkaTopic = conn.model('kafkaTopic', kafkaTopicSchema);

module.exports = { kafkaTopic } 