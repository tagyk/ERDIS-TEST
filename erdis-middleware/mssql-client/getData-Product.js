const sql = require('mssql');
var { product } = require('./../server/models/product');
var { apiQueue } = require('./../server/models/apiQueue');
var { ErrorLog } = require('./../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');
var moment = require('moment');
var { kafka } = require('./../kafka-client/kafkaClient');

(async function () {
    try {

        //  console.log("sadf");
        //  var message = await kafka.messageConsumer(kafka.createClient(), "ERDISQUEUE", 0, false);


        getProduct(5637149101);
        
    } catch (err) {
        ErrorLog.AddLogData(err, " ", "getData-BillOfMaterial kafka");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;


async function getProduct(_recId) {
    try {

        let con = new mssqlClient("MidaxSender");
        let pool = await con.connect();
        let result = await pool.request()
            .input('AppCode_', sql.NVarChar, 'CL_TR_LIVE')
            .input('InventTableRecId', sql.BigInt, _recId)
            .execute('ERDIS.GetItemTable')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var products = result.recordset[i];
            await new product({
                itemId: products.itemId,
                itemName: products.itemName,
                color: products.color,
                size: products.size,
                style: products.style,
                brand: products.brand,
                season: products.season,
                businessGroup: products.businessGroup,
                businessGroupDesc: products.businessGroupDesc,
                divisionGroup: products.divisionGroup,
                divisionGroupDesc: products.divisionGroupDesc,
                retailGroup: products.retailGroup,
                retailGroupDesc: products.retailGroupDesc,
                inventDimId: products.inventDimId
            }).save();
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _recId, "getData-product getProduct()");
    }
};