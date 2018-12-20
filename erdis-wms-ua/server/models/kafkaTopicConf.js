const mongoose = require('mongoose');
//const validator = require('validator');

var kafkaTopicConfSchema = new mongoose.Schema({
    appId:{
        type: String
    },
    topicName:{
        type: String
    },
    description:{
        type: String
    },
    module:{
        type: String
    },
    partition:{
        type: String
    }
    
});

var kafkaTopicConf = mongoose.model('kafkaTopicConf', kafkaTopicConfSchema);


module.exports = { kafkaTopicConf }