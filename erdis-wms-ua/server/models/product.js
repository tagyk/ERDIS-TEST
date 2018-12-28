const mongoose = require('mongoose');
const { conn } = require('./../db/mongoose-erdis-middleware');


var productSchema = new mongoose.Schema({
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
    }
});
productSchema.index({ inventDimId: 1, itemId: 1 }, { unique: true });

var product = conn.model('product', productSchema);

module.exports = { product } 