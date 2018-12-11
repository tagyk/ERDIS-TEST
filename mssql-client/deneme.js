
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { mongoose } = require('./../server/db/mongoose');

ShippingReceipt.findOne()
    .where('numberOfBox').gt(2)
    .select('documentNum')
    .exec(function (err, data) {
        if (err) return handleError(err);
        console.log(data);
    });
    ShippingReceipt.find()
    .where('totalQTY').gt(5)
    .sort('totalQTY')
    .select('documentNum totalQTY')
    .exec(function (err, data) {
        if (err) return handleError(err);
        console.log(data);
    });


// (async function () {
//     let a = await ShippingReceipt.findOne({documentNum: "30678100"});
//     console.log(a);
// })()