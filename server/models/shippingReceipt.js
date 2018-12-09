const mongoose = require('mongoose');
const validator = require('validator');



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








var ShippingReceiptSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: ['Depo->Magaza', 'Depo->E-ticaret'],
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
    // Detay
    detailsLength: {
        type: Number
    },
    // Varış Ülkesi
    locationToCountry: {
        type: String
    },
    isReady: {
        type: Boolean,
        default: false
    },
    boxHeader: [boxHeaderSchema],
    eCommerces: [eCommerceSchema]
});

ShippingReceiptSchema.pre('save', function (next) {
    var shippingReceipt = this;
    shippingReceipt.createdAt = Date.now()
    next();
});
ShippingReceiptSchema.post('save', function (doc) {
    var shippingReceipt = this;
    if(shippingReceipt.totalQty + shippingReceipt.boxHeader.length == shippingReceipt._id){
        shippingReceipt.isReady = true;
        shippingReceipt.save();
    }

});

var ShippingReceipt = mongoose.model('ShippingReceipt', ShippingReceiptSchema);

module.exports = { ShippingReceipt }

