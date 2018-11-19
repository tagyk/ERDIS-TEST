const mongoose = require('mongoose');
const validator = require('validator');


var ShippingReceiptStatusSchema = new mongoose.Schema({

    refBoxId:{ 
        type: mongoose.Schema.Types.ObjectId 
    },
    status:{
        type: String,
        enum: ['Hazır','Alındı','Yolda',"Teslim edildi"],
    },
    documentLocation:{
        type: String
    },
    documentNum:{
        type: String
    },
    boxBarcode:{
        type: String
    }

});

var ShippingReceiptStatus = mongoose.model('ShippingReceiptStatus', ShippingReceiptStatusSchema);

module.exports = {ShippingReceiptStatus}
