
const mongoose = require('mongoose-erdis-config');
//const validator = require('validator');

var kafkaErrorLogSchema = new mongoose.Schema({
    appId: {
        type: String
    },
    topicName: {
        type: String
    },
    errorMessage: {
        type: String
    },
    errorType: {
        type: String
    },
    errorTime: {
        type: Date
    },
    module: {
        type: String
    },
    partition: {
        type: String
    },
    recordId: {
        type: String
    }
});

var kafkaErrorLog = mongoose.model('kafkaErrorLog', kafkaErrorLogSchema);

module.exports = { kafkaErrorLog } 