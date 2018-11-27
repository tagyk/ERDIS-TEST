const sql = require('mssql');
const fs = require("fs");
var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { ShippingReceiptStatus } = require('./../server/models/ShippingReceiptStatus');
var { myPool } = require('./myPool');


async function getEnt009(_ENT009) {
    try {
        let documentNum;
        await new ShippingReceipt({
            documentNum: _ENT009.DocNum,
            documentDate: _ENT009.DocDate,
            detailsLength: _ENT009.DetailsCount,
            locationFrom: _ENT009.LocationFrom,
            locationFromAccount: _ENT009.LocationFromAccount,
            locationTo: _ENT009.LocationTo,
            locationToAccount: _ENT009.LocationToAccount,
            locationToAddress: _ENT009.locationToAddress
        }).save().then((temp) => {
            documentNum = temp.documentNum;
        });
        await getEnt075(documentNum);
    }

    catch (err) {
        console.log(err);
    }
};




// async function getEnt009(_documentNum, _totalQty) {
//     try {
//         let documentNum;
//         let pool = await myPool.newPool();
//         let result = await pool.request()
//             .input('input_parameter', sql.NVarChar, _documentNum)
//             .query('select S09INUM,S09IRTR from ENT009 where S09INUM = @input_parameter')
//         for (var i = 0, len = result.rowsAffected; i < len; i++) {
//             var ENT009 = result.recordset[i];
//             await new ShippingReceipt({
//                 documentNum: ENT009.S09INUM,
//                 documentDate: ENT009.S09IRTR,
//                 totalQTY: _totalQty
//             }).save().then((temp) => {
//                 documentNum = temp.documentNum;
//             });
//             await getEnt075(documentNum);
//         }
//     }
//     catch (err) {
//         console.log(err);
//     }
// };


async function getEnt075(_documentNum) {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('documentNum', sql.NVarChar, _documentNum)
            .execute('dbo.getBoxHeader')
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT0075 = result.recordset[i];
            let vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
            if (vShippingReceipt.locationToAccount !== '') vShippingReceipt.locationToAccount = ENT0075.S75SFIRM;
            await vShippingReceipt.boxHeader.push({ barcode: ENT0075.S75KOLINO });
            await vShippingReceipt.save();
            await new ShippingReceiptStatus({
                documentNum: vShippingReceipt.documentNum,
                refBoxId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id,
                boxBarcode: ENT0075.S75KOLINO,
                status: "Hazır",
                location: "Depo"
            }).save();
            await getEnt076({ docId: vShippingReceipt._id, boxNo: ENT0075.S75KOLINO, subId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id });
        }
    }
    catch (err) {
        console.log(err);
    }
};

async function getEnt076(_doc) {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('boxBarcode', sql.NVarChar, _doc.boxNo)
            .execute('dbo.getBoxDetails')
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT0076 = result.recordset[i];
            var _ShippingReceipt = await ShippingReceipt.findById(_doc.docId);
            var sub = await _ShippingReceipt.boxHeader.id(_doc.subId);
            if (ENT0076.IsAsorti == 1) {
                await sub.boxDetails.push({ barcode: ENT0076.Barcode, qty: ENT0076.Qty, isAssorment: ENT0076.IsAsorti, assormentBarcode: ENT0076.AsortiBarcode });
            }
            else {
                await sub.boxDetails.push({ barcode: ENT0076.Barcode, qty: ENT0076.Qty, isAssorment: ENT0076.IsAsorti });
            }
            await _ShippingReceipt.save();

        }
    } catch (err) {
        console.log(err);
    }

};

sql.on('error', err => {
    console.log(err);
});

(async function () {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('offset', sql.Int, 0)
            .execute('dbo.getDocument')
        //.output('output_parameter', sql.VarChar(50))
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT009 = result.recordset[i];
            await getEnt009(ENT009);
            //await getEnt009(result.recordset[i].DocNum, result.recordset[i].DetailsCount);
        }
    } catch (err) {
        // ... error checks
        console.log(err);
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;



