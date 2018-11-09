const sql = require("mssql");
const fs = require("fs");

class shippingReceiptModel {


    constructor(_documentNum, _documentDate) {
        this.documentNum = _documentNum;
        this.documentDate = _documentDate;
        this.boxHeaders = new Array();
    };
    addboxHeaders(_boxHeaderModel) {
        // this.boxHeaders = [];
        this.boxHeaders.push(_boxHeaderModel);
    };
}
class boxHeaderModel {


    constructor(documentNum,boxHeaderNo, locationToAccount) {
       // this.documentNum = documentNum;
        this.boxHeaderNo = boxHeaderNo;
        this.locationToAccount = locationToAccount;
        this.boxDetails = new Array();
    }
    addDetails(_barcode, _qty, _boxnum) {
        // this.boxDetails = [];
        this.boxDetails.push({
            barcode: _barcode,
            qty: _qty,
            boxNum: _boxnum
        });
    };
}


var webconfig = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    options: {
        trustedConnection: false,
        encrypt: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};


let shippingReceipt;
let ENT009;
let ENT0075, ENT0076;
let boxheader;

var boxheaderObject = (_boxheader) => {
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        request.query(`select *  from ENT0076  where S76KOLINO = ${_boxheader.boxHeaderNo}`, function (err, result) {
            if (err) console.log("ENT0076  " + err);
            for (var k = 0, len = result.rowsAffected; k < len; k++) {
                ENT0076 = result.recordset[k];
                _boxheader.addDetails(ENT0076.S76SKU, ENT0076.S76MIKTAR, ENT0076.S76KOLINO);
            }
            resolve(_boxheader);
        });
    })
};

var Ent75 = (_shippingReceipt) => {
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        request.query(`select S75KOLINO,S75SFIRM from ENT0075 where S75IRNO = ${_shippingReceipt.documentNum} group by S75KOLINO,S75SFIRM`, function (err, results) {
            if (err) console.log("ENT0075  " + err);
            
            for (var i = 0, len = results.rowsAffected; i < len; i++) {
                ENT0075 = results.recordset[i];
                // console.log(ENT0075.S75KOLINO);
                boxheader = new boxHeaderModel(_shippingReceipt.documentNum,ENT0075.S75KOLINO, ENT0075.S75SFIRM);
                boxheaderObject(boxheader).then(function (_boxheader) {
                    _shippingReceipt.addboxHeaders(_boxheader);
                    //console.log(JSON.stringify(_shippingReceipt,null,2));
                    // fs.appendFile('tmp.json',JSON.stringify(_shippingReceipt,null,2));
                }
                );;
            }
            fs.appendFile('tmp.json',JSON.stringify(_shippingReceipt,null,2));
            resolve();
        });
    })
};


var Ent09 = () => {
    let shippingReceipts = [];
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        // query to the database and get the records
        request.query("select * from ENT009 where S09INUM in ('30518908','30680025','30521329')", function (err, result) {
            if (err) console.log("ENT009  " + err);
            for (var i = 0, len = result.rowsAffected; i < len; i++) {
                ENT009 = result.recordset[i];
                shippingReceipt = new shippingReceiptModel(ENT009.S09INUM, ENT009.S09IRTR);
                Ent75(shippingReceipt).then(function (_shippingReceipt) {
                   // console.log(JSON.stringify(_shippingReceipt,null,2));
                  
                   // console.log(_shippingReceipt);
                });
            }
            //console.log(_shippingReceipt);
            resolve(shippingReceipts);
        });
        // console.log(shippingReceipts[0]);
    })
};











sql.connect(webconfig, function (err) {

    if (err) console.log(err);
    // create Request object
    Ent09().then(function (_shippingReceipts) {
        _shippingReceipts.forEach(element => {
            console.log(element);
        });
    });
});
//mlh
