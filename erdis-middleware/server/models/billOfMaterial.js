const mongoose = require('mongoose');
const { conn } = require('./../db/mongoose-erdis-middleware');

var barcodeSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    description: {
        type: String
    },
    countryOfOrigin: {
        type: String
    }
});
var assormentBarcodeLineSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});
var assormentBarcodeSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    description: {
        type: String
    },
    countryOfOrigin: {
        type: String
    },
    assormentBarcodesLines: [assormentBarcodeLineSchema],
});


var billOfMaterialSchema = new mongoose.Schema({
    itemId: {
        type: String
    },
    itemName: {
        type: String
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    style: {
        type: String
    },
    brand: {
        type: String
    },
    season: {
        type: String
    },
    businessGroup: {
        type: String
    },
    businessGroupDesc: {
        type: String
    },
    divisionGroup: {
        type: String
    },
    divisionGroupDesc: {
        type: String
    },
    retailGroup: {
        type: String
    },
    retailGroupDesc: {
        type: String
    },
    inventDimId: {
        type: String
    },
    barcodes: [barcodeSchema],
    assormentBarcodes: [assormentBarcodeSchema],
});

var billOfMaterial = conn.model('billOfMaterial', billOfMaterialSchema);

module.exports = { billOfMaterial } 