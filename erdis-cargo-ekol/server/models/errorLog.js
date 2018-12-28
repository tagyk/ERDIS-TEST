const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
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
    errorLog.createdAt = Date.now()
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


var ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema);


module.exports = { ErrorLog }
