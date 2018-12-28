const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-wms-ua');

const AccountTypes = Object.freeze({
    Cust: 'CustTable',
    Vend: 'VendTable',
});

var custVendSchema = new mongoose.Schema({

    transType: {
        type: String,
        enum: Object.values(AccountTypes),
    },

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

Object.assign(custVendSchema.statics, {
    AccountTypes,
});

custVendSchema.pre('save', function (next) {
    var custVend = this;
    custVend.createdAt = Date.now(); 
    next();
});

var custVend = conn.model('custVend', custVendSchema);

module.exports = { custVend } 