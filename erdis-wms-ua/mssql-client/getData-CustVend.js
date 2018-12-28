const sql = require('mssql');
const fs = require("fs");
var { mongoose } = require('../server/db/mongoose-erdis-wms-ua');
var { custVend } = require('../server/models/custVend');
var { custTable } = require('../server/models/custTable');
var { vendTable } = require('../server/models/vendTable');
var { ErrorLog } = require('../server/models/ErrorLog');
var mssqlClient = require('./mssqlClient');


async function getCustVendTable(_type) {
    try {
        let custVendAccount;
        let con = new mssqlClient("CLUA");
        let pool = await con.connect();
        let result = await pool.request()
            .input('parmtype', sql.NVarChar, _type)
            .execute('ERDIS.getCustVend')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var custVendTable = result.recordset[i];
            await new custVend ({
                transType: custVend.AccountTypes.Cust,
                accountNum: custVendTable.ACCOUNTNUM,
                name: custVendTable.NAME,
                address: custVendTable.ADDRESS,
                phone: custVendTable.PHONE,
                invoiceAccount: custVendTable.INVOICEACCOUNT,
                custGroup: custVendTable.CUSTGROUP,
                dimension1: custVendTable.DIMENSION1,
                dimension2: custVendTable.DIMENSION2,
                dimension6: custVendTable.DIMENSION6,
                countryRegionId: custVendTable.COUNTRYREGIONID,
                inventLocation: custVendTable.INVENTLOCATION,
                state: custVendTable.STATE,
                email: custVendTable.EMAIL,
                nameAlias: custVendTable.NAMEALIAS,
                street: custVendTable.STREET,
                segmentId: custVendTable.SEGMENTID,
                etgSalesType: custVendTable.ETGSALESTYPE,
                etgFirmId: custVendTable.ETGFIRMID,
                partyType: custVendTable.PARTYTYPE,
                vatNum: custVendTable.VATNUM
            }).save().then((temp) =>{
                custVendAccount = temp.accountNum;
            })
    }
}
catch (err) {
    ErrorLog.AddLogData(err, "" , _type + "table getCustVend()");
}
};            

async function getVendTable(_recId) {
    try {
        let vendAccount;
        let con = new mssqlClient("CLUA");
        let pool = await con.connect();
        let result = await pool.request()
            .input('parmtype', sql.NVarChar, _recId)
            .execute('ERDIS.getVendTable')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var VendTableData = result.recordset[i];
            await new vendTable ({
                accountNum: VendTableData.ACCOUNTNUM,
                name: VendTableData.NAME,
                address: VendTableData.ADDRESS,
                phone: VendTableData.PHONE,
                invoiceAccount: VendTableData.INVOICEACCOUNT,
                vendGroup: VendTableData.VENDGROUP,
                dimension1: VendTableData.DIMENSION1,
                dimension2: VendTableData.DIMENSION2,
                dimension6: VendTableData.DIMENSION6,
                countryRegionId: VendTableData.COUNTRYREGIONID,
                inventLocation: VendTableData.INVENTLOCATION,
                state: VendTableData.STATE,
                email: VendTableData.EMAIL,
                nameAlias: VendTableData.NAMEALIAS,
                street: VendTableData.STREET,
                segmentId: VendTableData.SEGMENTID,
                etgSalesType: VendTableData.ETGSALESTYPE,
                etgFirmId: VendTableData.ETGFIRMID,
                partyType: VendTableData.PARTYTYPE,
                vatNum: VendTableData.VATNUM
            }).save().then((temp) =>{
                vendAccount = temp.accountNum;
            })
    }
}
catch (err) {
    ErrorLog.AddLogData(err, "" , _recId + "table getVendTable()");
}
}; 



async function getCustTable(_recId) {
    try {
        let custAccount;
        let con = new mssqlClient("CLUA");
        let pool = await con.connect();
        let result = await pool.request()
            .input('parmtype', sql.NVarChar, _recId)
            .execute('ERDIS.getCustTable')
        await con.disconnect();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var CustTableData = result.recordset[i];
            await new vendTable ({
                accountNum: CustTableData.ACCOUNTNUM,
                name: CustTableData.NAME,
                address: CustTableData.ADDRESS,
                phone: CustTableData.PHONE,
                invoiceAccount: CustTableData.INVOICEACCOUNT,
                custGroup: CustTableData.CUSTGROUP,
                dimension1: CustTableData.DIMENSION1,
                dimension2: CustTableData.DIMENSION2,
                dimension6: CustTableData.DIMENSION6,
                countryRegionId: CustTableData.COUNTRYREGIONID,
                inventLocation: CustTableData.INVENTLOCATION,
                state: CustTableData.STATE,
                email: CustTableData.EMAIL,
                nameAlias: CustTableData.NAMEALIAS,
                street: CustTableData.STREET,
                segmentId: CustTableData.SEGMENTID,
                etgSalesType: CustTableData.ETGSALESTYPE,
                etgFirmId: CustTableData.ETGFIRMID,
                partyType: CustTableData.PARTYTYPE,
                vatNum: CustTableData.VATNUM
            }).save().then((temp) =>{
                custAccount = temp.accountNum;
            })
    }
}
catch (err) {
    ErrorLog.AddLogData(err, "" , _recId + "table getCustTable()");
}
}; 







(async function () {
    try {
        getCustVendTable('cust');
    } catch (err) {
        ErrorLog.AddLogData(err, " ", "CustVend kafka");
    }
})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;

