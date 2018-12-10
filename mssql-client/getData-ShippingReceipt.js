const sql = require('mssql');
const fs = require("fs");
var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { ShippingReceiptStatus } = require('./../server/models/ShippingReceiptStatus');
var { ErrorLog } = require('./../server/models/ErrorLog');
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
            locationToAddress: _ENT009.locationToAddress,
            locationToCountry: _ENT009.locationToCountry,
            transactionType: _ENT009.TransactionType
        }).save().then((temp) => {
            documentNum = temp.documentNum;
        });
        getEnt075(documentNum);
    }

    catch (err) {
        ErrorLog.AddLogData(err,_ENT009.DocNum,"Shipping Receipt getEnt009()");
    }
};



async function getEnt075(_documentNum) {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('documentNum', sql.NVarChar, _documentNum)
            .execute('dbo.getBoxHeader')
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT0075 = result.recordset[i];
            let vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
            await vShippingReceipt.boxHeader.push({ 
                boxBarcode: ENT0075.BoxBarcode,
                volume: ENT0075.Volume,
                volumetricWeight: ENT0075.VolumetricWeight,
                weight: ENT0075.Weight
            });
            await vShippingReceipt.save();
            await new ShippingReceiptStatus({
                documentNum: vShippingReceipt.documentNum,
                refBoxId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id,
                boxBarcode: ENT0075.BoxBarcode,
                status: "Hazır",
                location: "Depo"
            }).save();
            getEnt076({ documentNum:_documentNum, docId: vShippingReceipt._id, boxNo: ENT0075.BoxBarcode, subId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id });
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err,_documentNum,"Shipping Receipt getEnt075()");
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
        ErrorLog.AddLogData(err,_doc.documentNum,"Shipping Receipt getEnt076()");
    }

};

sql.on('error', err => {
    console.log(err);
});

(async function () {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('offset', sql.Int, 2)
            .execute('dbo.getDocument')
        //.output('output_parameter', sql.VarChar(50))
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var ENT009 = result.recordset[i];
            getEnt009(ENT009);
            //await getEnt009(result.recordset[i].DocNum, result.recordset[i].DetailsCount);
        }
    } catch (err) {
        ErrorLog.AddLogData(err," ","Shipping Receipt dbo.getDocument");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;



