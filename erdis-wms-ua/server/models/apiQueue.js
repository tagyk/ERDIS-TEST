const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-wms-ua');
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    refObjectId: {
        type: ObjectId
    }

});
apiQueueSchema.pre('save', function (next) {
    var apiQueue = this;
    apiQueue.createdAt = Date.now(); // moment(Date.now()).format('DD-MM-YYYY');
    next();
});
apiQueueSchema.index({documentName: 1, keyValue: 1}, {unique: true});

var apiQueue = conn.model('apiQueue', apiQueueSchema);

module.exports = { apiQueue } 