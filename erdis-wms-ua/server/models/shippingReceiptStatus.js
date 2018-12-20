const mongoose = require('mongoose');
const validator = require('validator');
const {conn} = require('../db/mongoose-erdis-cargo-ekol');

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
    location: {
        type: String
    },
    documentNum: {
        type: String
    },
    boxBarcode: {
        type: String
    },
    createdAt: {
        type: Date
    },
    statusUpdatedAt: {
        type: Date
    },
    locationUpdatedAt: {
        type: Date
    },
    statusTimeline: [timelineSchema],
    
    locationTimeline: [timelineSchema]




});
// ShippingReceiptStatusSchema.pre('update', function () {
//     this.update({}, { $set: { updated_at: new Date() } });
// });



var ShippingReceiptStatus = conn.model('ShippingReceiptStatus', ShippingReceiptStatusSchema);


module.exports = { ShippingReceiptStatus }
