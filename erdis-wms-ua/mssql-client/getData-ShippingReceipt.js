const sql = require('mssql');
const fs = require("fs");

var { ShippingReceipt } = require('./../server/models/ShippingReceipt');

var { ErrorLog } = require('./../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');
var moment = require('moment');
var {kafka} = require('./../kafka-client/kafkaClient');




async function getDispatchHeader(_dispatchNum) {
    try {
        let documentNum;
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('DispatchNum', sql.NVarChar, _dispatchNum)
            .execute('ERDIS.GetDispatchHeader')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var dispatchHeader = result.recordset[i];
            await new ShippingReceipt({
                transactionType: ShippingReceipt.TransactionTypes.DD,
                movementType: dispatchHeader.movementType,
                documentType: '',
                documentStatus: dispatchHeader.documentStatus,
                documentNum: dispatchHeader.documentNum,
                documentDate: moment(dispatchHeader.documentDate).format('DD-MM-YYYY'),
                locationTo: dispatchHeader.locationTo,
                locationFrom: dispatchHeader.locationFrom,
                locationToAccount: dispatchHeader.locationToAccount,
                locationFromAccount: dispatchHeader.locationFromAccount,
                shippingCompany: 'EKOL',
                totalQTY: dispatchHeader.totalQTY,
                numberOfBox: dispatchHeader.numberOfBox,
                numberOfBarcode: dispatchHeader.numberOfBarcode,
                locationFromAddress: '',
                locationToAddress: dispatchHeader.locationToAddress,
                locationToCountry: dispatchHeader.locationToCountry,
                refAxCode: dispatchHeader.refAxCode
            }).save().then((temp) => {
                documentNum = temp.documentNum;
            });
            getBoxHeader(documentNum);
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _dispatchNum, "ShippingReceipt getDispatchHeader()");
    }
};



async function getBoxHeader(_dispatchNum) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('DispatchNum', sql.NVarChar, _dispatchNum)
            .execute('ERDIS.GetBoxHeader')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var boxHeader = result.recordset[i];
            let vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _dispatchNum });
            await vShippingReceipt.boxHeader.push({
                boxBarcode: boxHeader.boxBarcode,
                totalQty: boxHeader.totalQty,
                volume: boxHeader.volume,
                volumetricWeight: boxHeader.volumetricWeight,
                weight: boxHeader.weight,
                numberOfBarcode: boxHeader.numberOfBarcode
            });
            await vShippingReceipt.save();
            getBoxDetails({ documentNum: _dispatchNum, docId: vShippingReceipt._id, boxNo: boxHeader.boxBarcode, subId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id })
                .then(() => {
                    ShippingReceipt.findOne({ documentNum: _dispatchNum }, function (err, sr) {
                        if (sr.numberOfBox + sr.numberOfBarcode == sr.__v && sr.isReady == false) {
                            ShippingReceipt.findOneAndUpdate({ documentNum: _dispatchNum }, { $set: { isReady: 'true' } }, { new: true }, function (err, result) {
                                if (err) ErrorLog.AddLogData(err, sr.documentNum, "getEnt076 then");
                            });
                        }
                    });
                }).catch((e) => {
                    ErrorLog.AddLogData(err, _dispatchNum, "ShippingReceiptStatus getBoxHeader()");
                });
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _dispatchNum, "Shipping Receipt getBoxHeader()");
    }
};

async function getBoxDetails(_doc) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('boxBarcode', sql.NVarChar, _doc.boxNo)
            .execute('ERDIS.GetBoxDetails')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var boxDetail = result.recordset[i];
            var _ShippingReceipt = await ShippingReceipt.findById(_doc.docId);
            var sub = await _ShippingReceipt.boxHeader.id(_doc.subId);
            if (boxDetail.IsAsorti == 1) {
                await sub.boxDetails.push({ barcode: boxDetail.barcode, qty: boxDetail.qty, isAssorment: boxDetail.isAsorti, assormentBarcode: boxDetail.asortiBarcode });
            }
            else {
                await sub.boxDetails.push({ barcode: boxDetail.barcode, qty: boxDetail.qty, isAssorment: boxDetail.isAsorti });
            }
            await _ShippingReceipt.save();

        }
    } catch (err) {
        ErrorLog.AddLogData(err, _doc.documentNum, "Shipping Receipt getBoxDetails()");
    }

};

sql.on('error', err => {
    console.log(err);
});

(async function () {
    try {

         console.log("sadf");
         var message = await kafka.messageConsumer(kafka.createClient(), "ERDISQUEUE", 0, false);


        getDispatchHeader('30680306');







        // let con = new mssqlClient("Depo");
        // let pool = await con.connect();
        // let result = await pool.request()
        //     .input('offset', sql.Int, 2)
        //     .execute('dbo.getDocument')
        // await con.disconnect();
        // //.output('output_parameter', sql.VarChar(50))
        // for (var i = 0, len = result.recordset.length; i < len; i++) {
        //     var dispatchNum = result.recordset[i];
        
        //await getEnt009(result.recordset[i].DocNum, result.recordset[i].DetailsCount);
        //}
    } catch (err) {
        ErrorLog.AddLogData(err, " ", "ShippingReceipt kafka");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;



