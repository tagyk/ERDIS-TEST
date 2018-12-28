const mongoose = require('mongoose');
const {conn} = require('./../db/mongoose-erdis-config');
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

var kafkaErrorLog = conn.model('kafkaErrorLog', kafkaErrorLogSchema);

module.exports = { kafkaErrorLog } 