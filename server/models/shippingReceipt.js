const mongoose = require('mongoose');
const validator = require('validator');



var eCommerceSchema = new mongoose.Schema({
    name:{
        type: String
    },
    surname:{
        type: String
    },
    phone:{
        type: String
    },
    county:{
        type: String
    },
    state:{
        type: String
    }
    
});
var boxDetailSchema = new mongoose.Schema({
    
    barcode:{
        type: String
    },
    qty:{
        type: Number
    }
});

var boxHeaderSchema = new mongoose.Schema({
    status:{
        type: Boolean
    },
    barcode:{
        type: String
    },
    
    totalQty:{
        type: Number
    },
    type:{
        type: String
    },
    volume:{
        type: Number
    },
    boxDetails : [boxDetailSchema]
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
        type: String,
        enum: ['Aktif', 'Pasif'],
        
    },
    documentNum:{
        type: String
    },
    documentDate:{
        type: String
    },
    locationTo:{
        type: String
    },
    locationFrom:{
        type: String
    },
    locationToAccount:{
        type: String
    },
    locationFromAccount:{
        type: String
    },
    shippingCompany:{
        type: String
    },
    //Toplam Ürün Adedi
    totalQTY:{
        type: Number
    },
    //Toplam Koli Sayısı
    numberOfBox:{ 
        type: Number
    },
    //Çıkış Noktası Adres
    locationFromAddress:{
        type: String
    },
    //Varış Noktası Adres
    locationToAddress:{
        type: String
    },
    boxHeader : [boxHeaderSchema],
    eCommerces : [eCommerceSchema]
});

var ShippingReceipt = mongoose.model('ShippingReceipt', ShippingReceiptSchema);

module.exports = {ShippingReceipt}

