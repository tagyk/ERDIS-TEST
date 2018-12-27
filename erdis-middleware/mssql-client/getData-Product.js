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

        let con = new mssqlClient("ColinsTR_ReadOnly");
        let pool = await con.connect();
        let result = await pool.request()
            .input('dataAreaId', sql.NVarChar, 'v01')
            .input('InventTableRecId', sql.BigInt, _recId)
            .execute('ERDIS.GetItemTable')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var products = result.recordset[i];
            await new product({
                itemId: products.itemId,
                itemName: products.itemName,
                inventDimId: products.inventDimId,
                season: products.season,
                color: products.color,
                style: products.style,
                size: products.size,
                brand: products.brand,
                businessGroup: products.businessGroup,
                businessGroupDesc: products.businessGroupDesc,
                divisionGroup: products.divisionGroup,
                divisionGroupDesc: products.divisionGroupDesc,
                retailGroup: products.retailGroup,
                retailGroupDesc: products.retailGroupDesc,
            }).save();
        }
    }
    catch (err) {
        ErrorLog.AddLogData(err, _recId, "getData-product getProduct()");
    }
};