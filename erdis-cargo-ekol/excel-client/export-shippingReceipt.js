/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* eslint-env node */
/* global Promise */
const XLSX = require('xlsx');


var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');


var path = 'C:/Users/melih.topraksever/Desktop/mongo.xlsx';



(async function () {

    var result = [];
    var prefix_out = "your info";

    var a = await ShippingReceipt.find({}).limit(10).
        cursor().
        on("data", function (doc) {
            //stream ---> string
            var str = JSON.stringify(doc)
            //sring ---> JSON
            var json = JSON.parse(str);
            //handle Your Property
            json.handleYourProperty = prefix_out + json.imageURL;
            result.push(result);
        }).
        on('error', function (err) {
            console.log(err);
        }).
        on('close', function () {
            console.log(result);
        });



      


    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(data);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, data, "People");

    /* generate an XLSX file */
    XLSX.writeFile(wb, "sheetjs.xlsx");


})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;
