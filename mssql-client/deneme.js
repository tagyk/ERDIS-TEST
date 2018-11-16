
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');

var ShippingReceipts = ShippingReceipt.find()
.where('totalQTY').gt(50)
.sort('totalQTY')
.select('totalQTY documentNum')
.exec(function(err,data){
    if(!err){
        console.log(data);
    }
});
