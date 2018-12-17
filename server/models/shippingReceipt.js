const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
var { ErrorLog } = require('./ErrorLog');
var moment = require('moment');




var eCommerceSchema = new mongoose.Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    phone: {
        type: String
    },
    county: {
        type: String
    },
    state: {
        type: String
    }

});
var boxDetailSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    qty: {
        type: Number
    },
    isAssorment: {
        type: Boolean
    },
    assormentBarcode: {
        type: String
    }
});

var boxHeaderSchema = new mongoose.Schema({
    boxBarcode: {
        type: String
    },
    totalQty: {
        type: Number
    },
    volume: {
        type: Number
    },
    volumetricWeight: {
        type: Number
    },
    weight: {
        type: Number
    },
    boxDetails: [boxDetailSchema]
});

const TransactionTypes = Object.freeze({
    DM: 'Depo->Magaza',
    DE: 'Depo->E-ticaret',
    DD: 'Depo->Depo',
});






var ShippingReceiptSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: Object.values(TransactionTypes),
    },
    movementType: {
        type: String,
    },
    documentType: {
        type: String

    },
    documentStatus: {
        type: Boolean
    },
    documentNum: {
        type: String,
        unique: true,
        required: true
    },
    documentDate: {
        type: String
    },
    locationTo: {
        type: String
    },
    locationFrom: {
        type: String
    },
    locationToAccount: {
        type: String
    },
    locationFromAccount: {
        type: String
    },
    shippingCompany: {
        type: String
    },
    //Toplam Ürün Adedi
    totalQTY: {
        type: Number
    },
    //Toplam Koli Sayısı
    numberOfBox: {
        type: Number
    },
    //Toplam Barkod Çeşidi
    numberOfBarcode: {
        type: Number
    },
    //Çıkış Noktası Adres
    locationFromAddress: {
        type: String
    },
    //Varış Noktası Adres
    locationToAddress: {
        type: String
    },
    createdAt: {
        type: Date
    },

    // Varış Ülkesi
    locationToCountry: {
        type: String
    },
    isReady: {
        type: Boolean,
        default: false
    },
    // AX'da oluşan kayıtın refrans id si
    refAxCode: {
        type: String
    },

    boxHeader: [boxHeaderSchema],
    eCommerces: [eCommerceSchema]
});

Object.assign(ShippingReceiptSchema.statics, {
    TransactionTypes,
});

ShippingReceiptSchema.methods.toJSON = function () {
    var shippingReceipt = this;
    var shippingReceiptObject = shippingReceipt.toObject();

    return _.pick(shippingReceiptObject, ['_id', 'transactionType', 'documentNum', 'documentDate', 'locationTo', 'locationToAddress', 'locationFrom', 'locationFromAddress', 'boxHeader']);
};

ShippingReceiptSchema.pre('save', function (next) {
    var shippingReceipt = this;
    shippingReceipt.createdAt = moment(Date.now()).format('DD-MM-YYYY');
    next();
});
// boxDetailSchema.post('save', function(doc, next){
//     if (this.__parent.__parent.numberOfBarcode + this.__parent.__parent.numberOfBox  == this.__parent.__parent.__v) {
//         ShippingReceipt.findByIdAndUpdate(this.__parent.__parent.id, { $set: { isReady: 'true' } }, { new: true }, function (err, result) {
//             if (err) ErrorLog.AddLogData(err, this.__parent.__parent.id, "shippingReceipt id  boxDetailSchema.post(save)");
//         });
//     }
//     next();
// });

var ShippingReceipt = mongoose.model('ShippingReceipt', ShippingReceiptSchema);

module.exports = { ShippingReceipt }

