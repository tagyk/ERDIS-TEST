const mongoose = require('mongoose');
const { conn } = require('./../db/mongoose-erdis-middleware');
const { ErrorLog } = require('./ErrorLog');
const { apiQueue } = require('./apiQueue');

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


// barcodeSchema.post('save', function (next) {
//     new apiQueue({
//         refObjectId: this._id,
//         documentName: "Barcode",
//         keyValue: this.barcode
//     }).save();
//     next();
// });



var barcode = conn.model('barcode', barcodeSchema);

module.exports = { barcode } 