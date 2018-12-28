const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-wms-ua');


var custTableSchema = new mongoose.Schema({

  
    accountNum: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    invoiceAccount: {
        type: String
    },
    custGroup: {
        type: String
    },
    dimension1: {
        type: String
    },
    dimension2: {
        type: String
    },
    dimension6: {
        type: String
    },
    countryRegionId: {
        type: String
    },
    inventLocation: {
        type: String
    },
    state: {
        type: String
    },
    email: {
        type: String
    },
    nameAlias: {
        type: String
    },
    street: {
        type: String
    },
    segmentId: {
        type: String
    },
    etgSalesType: {
        type: String
    },
    etgFirmId: {
        type: String
    },
    partyType: {
        type: String
    },
    VATNum: {
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
    isReady: {
        type: Boolean,
        default: false
    }

});

Object.assign(custTableSchema.statics, {
    AccountTypes,
});

custTableSchema.pre('save', function (next) {
    var custTable = this;
    custTable.createdAt = Date.now(); 
    next();
});

var custTable = conn.model('custVend', custTableSchema);

module.exports = { custTable } 