const sql = require('mssql');
var { billOfMaterial } = require('./../server/models/billOfMaterial');
var { apiQueue } = require('./../server/models/apiQueue');
var { ErrorLog } = require('./../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');
var moment = require('moment');
var { kafka } = require('./../kafka-client/kafkaClient');


(async function () {
    try {

        //  console.log("sadf");
        //  var message = await kafka.messageConsumer(kafka.createClient(), "ERDISQUEUE", 0, false);


        getItemTable('30680306');
        getItemTable('30705044');
        getItemTable('30704757');
        getItemTable('30704654');
        getItemTable('30704410');
        getItemTable('30704119');

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
        ErrorLog.AddLogData(err, " ", "getData-BillOfMaterial kafka");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;


async function getItemTable(_recId) {
    try {
        let bom;
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('DispatchNum', sql.NVarChar, _recId)
            .execute('ERDIS.GetDispatchHeader')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var billOfMaterials = result.recordset[i];
            await new billOfMaterial({
                itemId: billOfMaterials.itemId,
                itemName: billOfMaterials.itemName,
                color: billOfMaterials.color,
                size: billOfMaterials.size,
                style: billOfMaterials.style,
                brand: billOfMaterials.brand,
                season: billOfMaterials.season,
                businessGroup: billOfMaterials.businessGroup,
                businessGroupDesc: billOfMaterials.businessGroupDesc,
                divisionGroup: billOfMaterials.divisionGroup,
                divisionGroupDesc: billOfMaterials.divisionGroupDesc,
                retailGroup: billOfMaterials.retailGroup,
                retailGroupDesc: billOfMaterials.retailGroupDesc
            }).save().then((temp) => {
                bom = temp.itemId;
            });
            getBarcode(bom);
            getAssortmentBarcode(bom);
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _bom.itemId, "getData-BillOfMaterial getItemTable()");
    }
};
async function getBarcode(_bom) {
    try {
        let bom;
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('DispatchNum', sql.NVarChar, _bom)
            .execute('ERDIS.GetDispatchHeader')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var barcodes = result.recordset[i];
            let vbillOfMaterial = await billOfMaterial.findOne({ itemId: _bom.itemId });
            await vbillOfMaterial.barcodes.push({
                barcode: barcodes.barcode,
                description: barcodes.description,
                countryOfOrigin: barcodes.countryOfOrigin
            });
            await vbillOfMaterial.save();
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _bom.itemId, "getData-BillOfMaterial getBarcode()");
    }
};
async function getAssortmentBarcode(_bom) {
    try {
        let bom;
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('DispatchNum', sql.NVarChar, _bom)
            .execute('ERDIS.GetDispatchHeader')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var barcodes = result.recordset[i];
            let vbillOfMaterial = await billOfMaterial.findOne({ itemId: _bom.itemId });
            await vbillOfMaterial.assormentBarcodes.push({
                barcode: barcodes.barcode,
                description: barcodes.description,
                countryOfOrigin: barcodes.countryOfOrigin
            });
            await vbillOfMaterial.save();
            getAssortmentBarcodeLine({ bomId = vbillOfMaterial._id, subId: vbillOfMaterial.assormentBarcodes[vbillOfMaterial.assormentBarcodes.length - 1]._id });
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _bom.itemId, "getData-BillOfMaterial getAssortmentBarcode()");
    }
};
async function getAssortmentBarcodeLine(_assortmentBarcode) {
    try {
        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('boxBarcode', sql.NVarChar, _doc.boxNo)
            .execute('ERDIS.GetBoxDetails')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var assortmentBarcodeLines = result.recordset[i];
            var vbillOfMaterial = await billOfMaterial.findById(_assortmentBarcode.bomId);
            var sub = await vbillOfMaterial.assormentBarcodes.id(_assortmentBarcode.subId);
            await sub.assormentBarcodesLines.push({ barcode: assortmentBarcodeLines.barcode, qty: assortmentBarcodeLines.qty });
            await vbillOfMaterial.save();

        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _assortmentBarcode.subId, "getData-BillOfMaterial getAssortmentBarcodeLines()");
    }
};