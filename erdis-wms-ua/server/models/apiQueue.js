const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-wms-ua');

var apiQueueSchema = new mongoose.Schema({

    documentName: {
        type: String
    },
    keyValue: {
        type: String
    },
    isSent: {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    sentBy: {
        type: String
    },

});
apiQueueSchema.pre('save', function (next) {
    var apiQueue = this;
    apiQueue.createdAt = Date.now(); // moment(Date.now()).format('DD-MM-YYYY');
    next();
});

var apiQueue = conn.model('apiQueue', apiQueueSchema);

module.exports = { apiQueue } 