const mongoose = require('mongoose-erdis-config');


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

var kafkaTopic = mongoose.model('kafkaTopic', kafkaTopicSchema);

module.exports = { kafkaTopic } 