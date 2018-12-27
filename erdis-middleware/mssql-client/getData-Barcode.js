const sql = require('mssql');
var { barcode } = require('./../server/models/barcode');
var { apiQueue } = require('./../server/models/apiQueue');
var { ErrorLog } = require('./../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');
var moment = require('moment');
var { kafka } = require('./../kafka-client/kafkaClient');


(async function () {
    try {

        //  console.log("sadf");
        //  var message = await kafka.messageConsumer(kafka.createClient(), "ERDISQUEUE", 0, false);


        getBarcode(5638493037);
        getBarcodeAssortment(5637218846);
        // getItemTable('30705044');
        // getItemTable('30704757');
        // getItemTable('30704654');
        // getItemTable('30704410');
        // getItemTable('30704119');

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
        ErrorLog.AddLogData(err, " ", "getData-barcode kafka");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;

async function getBarcode(_recId) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('RecId', sql.BigInt, _recId)
            .execute('ERDIS.GetBarcodeRecId')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            let bom;
            var barcodes = result.recordset[i];
            await new barcode({
                barcode: barcodes.barcode,
                description: barcodes.description,
                countryOfOrigin: barcodes.countryOfOrigin,
            }).save().then((temp) => {
                bom = temp;
            });
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _recId, "getData-Barcode getBarcode()");
    }
};
async function getBarcodeAssortment(_recId) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('RecId', sql.BigInt, _recId)
            .execute('ERDIS.GetAssortmentBarcodeRecId')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            let bom;
            var barcodes = result.recordset[i];
            await new barcode({
                barcode: barcodes.barcode,
                description: barcodes.description,
                countryOfOrigin: barcodes.countryOfOrigin,
                numberOfBarcodes: barcodes.numberOfBarcodes,
                isAssortment: true
            }).save().then((temp) => {
                bom = temp;
            });
            getAssortmentBarcodeLine(bom).then(() => {
                barcode.findOne({ barcode: bom.barcode }, function (err, b) {
                    if (b.numberOfBarcodes == b.__v && b.isReady == false) {
                        barcode.findOneAndUpdate({ barcode: bom.barcode }, { $set: { isReady: 'true' } }, { new: true }, function (err, result) {
                            if (err) ErrorLog.AddLogData(err, bom.barcode, "getData-Barcode getBarcodeAssortment().then()");
                        });
                    }
                });
            }).catch((err) => {
                ErrorLog.AddLogData(err, _dispatchNum, "getData-Barcode getBarcodeAssortment()");
            });;
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _recId, "getData-Barcode getBarcodeAssortment()");
    }
};

async function getAssortmentBarcodeLine(_assortmentBarcode) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('barcode', sql.NVarChar, _assortmentBarcode.barcode)
            .execute('ERDIS.GetAssortmentBarcodeLine')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var assortmentBarcodeLines = result.recordset[i];
            var assortmentBarcode = await barcode.findById(_assortmentBarcode._id);
            await assortmentBarcode.assormentBarcodeLines.push({ barcode: assortmentBarcodeLines.barcode, qty: assortmentBarcodeLines.qty });
            await assortmentBarcode.save();

        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _assortmentBarcode, "getData-BillOfMaterial getAssortmentBarcodeLines()");
    }
};