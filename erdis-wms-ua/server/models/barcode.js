const mongoose = require('mongoose');
const { conn } = require('./../db/mongoose-erdis-middleware');

var assormentBarcodeLineSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});

var barcodeSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    description: {
        type: String
    },
    countryOfOrigin: {
        type: String
    },
    isAssortment: {
        type: Boolean,
        default: false
    },
    isReady: {
        type: Boolean,
        default: false
    },
    numberOfBarcodes: {
        type: String
    },
    assormentBarcodeLines: [assormentBarcodeLineSchema],
    
});

barcodeSchema.index({ barcode: 1}, { unique: true });

var barcode = conn.model('barcode', barcodeSchema);

module.exports = { barcode } 