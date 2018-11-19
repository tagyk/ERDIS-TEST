const mongoose = require('mongoose');
const validator = require('validator');

var timelineSchema = new mongoose.Schema({

    prevStatus: {
        type: String
    },
    prevUpdateAt: {
        type: Date
    }
});

var ShippingReceiptStatusSchema = new mongoose.Schema({

    refBoxId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: ['Hazır', 'Alındı', 'Yolda', "Teslim edildi"],
    },
    documentLocation: {
        type: String
    },
    documentNum: {
        type: String
    },
    boxBarcode: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date
    },

    timeline: [timelineSchema]


});
// ShippingReceiptStatusSchema.pre('update', function () {
//     this.update({}, { $set: { updated_at: new Date() } });
// });

ShippingReceiptStatusSchema.pre('update', function (next) {
    var shippingReceiptStatus = this;
    //if (shippingReceiptStatus.isModified('status')) {
        shippingReceiptStatus.timeline.push({ prevStatus: shippingReceiptStatus.status, prevUpdateAt: shippingReceiptStatus.updated_at });
        shippingReceiptStatus.updated_at = new Date();
        next();
    // }
    // else {
    //     shippingReceiptStatus.update({}, { $set: { updated_at: new Date() } });
    // }
});

var ShippingReceiptStatus = mongoose.model('ShippingReceiptStatus', ShippingReceiptStatusSchema);

module.exports = { ShippingReceiptStatus }
