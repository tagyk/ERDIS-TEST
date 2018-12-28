const sql = require('mssql');
var { billOfMaterial } = require('./../server/models/billOfMaterial');
var { apiQueue } = require('./../server/models/apiQueue');
var { ErrorLog } = require('./../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');
var moment = require('moment');
var {kafka} = require('./../kafka-client/kafkaClient');


(async function () {
    try {

        //  console.log("sadf");
        //  var message = await kafka.messageConsumer(kafka.createClient(), "ERDISQUEUE", 0, false);


        getDispatchHeader('30680306');
        getDispatchHeader('30705044');
        getDispatchHeader('30704757');
        getDispatchHeader('30704654');
        getDispatchHeader('30704410');
        getDispatchHeader('30704119');

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