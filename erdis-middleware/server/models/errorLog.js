const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-middleware');
const validator = require('validator');
const _ = require('lodash');
var moment = require('moment');

var ErrorLogSchema = new mongoose.Schema({

    errorName: {
        type: String
    },
    errorCode: {
        type: String
    },
    errorMessage: {
        type: String
    },
    keyValue: {
        type: String
    },
    event: {
        type: String
    },
    createdAt: {
        type: Date
    }




});
ErrorLogSchema.pre('save', function (next) {
    var errorLog = this;
    errorLog.createdAt = moment(Date.now()).format('DD-MM-YYYY');
    next();
});


ErrorLogSchema.statics.AddLogData = function (_error, _keyValue, _event) {
    try {
        var data = _.pick(_error, ['code', 'name', 'message']);
        var errorLog = new ErrorLog({
            errorName: data.name,
            errorCode: data.code,
            errorMessage: data.message,
            keyValue: _keyValue,
            event: _event
        }).save();
    }
    catch (err) {
        return Promise.reject();
    }
};


var ErrorLog = conn.model('ErrorLog', ErrorLogSchema);


module.exports = { ErrorLog }
