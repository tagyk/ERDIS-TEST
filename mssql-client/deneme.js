
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { mongoose } = require('./../server/db/mongoose');
https://thecodebarbarian.com/node.js-task-scheduling-with-agenda-and-mongodb

// ShippingReceipt.findOne()
//     .where('totalQTY').gt(5)
//     .sort('totalQTY')
//     .select('documentNum')
//     .exec(function (err, data) {
//         if (err) return handleError(err);
//         console.log(data);
//     });
//     ShippingReceipt.find()
//     .where('totalQTY').gt(5)
//     .sort('totalQTY')
//     .select('documentNum totalQTY')
//     .exec(function (err, data) {
//         if (err) return handleError(err);
//         console.log(data);
//     });


// (async function () {
//     let a = await ShippingReceipt.findOne({documentNum: "30678100"});
//     console.log(a);
// })()

ShippingReceipt.find({ "locationToAccount": "MYY5637145035" }).toArray(function (err, result) {
    if (err) throw err

    console.log(result)
});

ShippingReceipt.find({ "locationToAccount": "MYY5637145035" }).then((result) =>{
    if (err) throw err

    console.log(result)
});
