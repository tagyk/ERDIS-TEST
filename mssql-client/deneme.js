
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { mongoose } = require('./../server/db/mongoose');
const XLSX = require('xlsx');
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

// ShippingReceipt.find({ "locationToAccount": "MYY5637145035" }).toArray(function (err, result) {
//     if (err) throw err

//     console.log(result)
// });

// ShippingReceipt.find({ "locationToAccount": "MYY5637145035" }).then((result) =>{
//     if (err) throw err

//     console.log(result)
// });


var result = [];
var prefix_out = "your info";

ShippingReceipt.find({}).limit(10).
    cursor().
    on("data", function (doc) {
        var a = doc.toJSON();
        result.push(a);
        /* add to workbook */
    


    }).
    on('error', function (err) {
        console.log(err);
    }).
    on('close', function () {
        console.log(result);
        var ws = XLSX.utils.aoa_to_sheet(result);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "a");
        XLSX.writeFile(wb, "sheetjs.xlsx");
    });
    

    /* generate an XLSX file */
   
    ShippingReceipt.find({}).limit(10)