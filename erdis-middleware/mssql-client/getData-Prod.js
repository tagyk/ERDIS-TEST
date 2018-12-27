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


        getDeneme();
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

async function getDeneme() {
    try {
        let con = new mssqlClient("ColinsTR_ReadOnly");
        let pool = await con.connect();
        let result = await pool.request()
        .input('input_parameter', sql.BigInt, 5639885833)
        .query('select * from INVENTITEMBARCODE where recid = @input_parameter')
        
        
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            let bom;
            var barcodes = result.recordset[i];
            console.log(barcodes);
        }
    }
    catch (err) {
        console.log(err);
    }
};