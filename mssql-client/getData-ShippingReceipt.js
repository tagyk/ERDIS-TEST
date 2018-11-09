const sql = require("mssql");
const fs = require("fs");
var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');

class shippingReceiptModel {


    constructor(_documentNum, _documentDate) {
        this.documentNum = _documentNum;
        this.documentDate = _documentDate;
        this.boxHeaders = new Array(boxHeaderModel);
    };
    addboxHeaders(_boxHeaderModel) {
        // this.boxHeaders = [];
        this.boxHeaders.push(_boxHeaderModel);

    };
}
class boxHeaderModel {


    constructor(documentNum, boxHeaderNo, locationToAccount) {
        // this.documentNum = documentNum;
        this.barcode = boxHeaderNo;
        this.locationToAccount = locationToAccount;
        this.boxDetails = new Array();
    }
    addDetails(_barcode, _qty, _boxnum) {
        // this.boxDetails = [];
        this.boxDetails.push({
            barcode: _barcode,
            qty: _qty
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

var boxheaderObject = (doc) => {
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        var boxHeaderNo = doc.boxHeader[0].barcode;
        request.query(`select *  from ENT0076  where S76KOLINO = ${boxHeaderNo}`, function (err, result) {
            if (err) console.log("ENT0076  " + err);
            for (var k = 0, len = result.rowsAffected; k < len; k++) {
                var someFunction = function (i, result) {
                    var ENT0076 = result.recordset[k];
                    ShippingReceipt.findById(doc._id, function (err, _ShippingReceipt) {
                        var subdoc = _ShippingReceipt.boxHeader.id(doc.boxHeader[0]._id);
                        subdoc.boxDetails.push({ barcode: ENT0076.S76SKU, qty: ENT0076.S76MIKTAR });
                        _ShippingReceipt.save()
                            .then((doc) => {
                                // console.log(doc);
                                //fs.appendFile('tmp.json',JSON.stringify(doc,null,2));
                                resolve(doc);
                            });
                    });
                };
                someFunction(k, result);
            }
        });
        resolve(true);
    });
};

var Ent75 = (_documentNum) => {
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        request.query(`select S75KOLINO,S75SFIRM from ENT0075 where S75IRNO = ${_documentNum} group by S75KOLINO,S75SFIRM`, function (err, results) {

            if (err) console.log("ENT0075  " + err);

            for (var i = 0, len = results.rowsAffected; i < len; i++) {
                var someFunction = function (i, results) {
                    var ENT0075 = results.recordset[i];
                    var promise = new Promise((resolve, reject) => {
                        ShippingReceipt.findOne({ documentNum: _documentNum }, function (err, ShippingReceipt) {
                            if (err) throw err;
                            ShippingReceipt.boxHeader.push({ barcode: ENT0075.S75KOLINO });
                            ShippingReceipt.save()
                                .then((doc) => {
                                    console.log(doc);
                                    //fs.appendFile('tmp.json',JSON.stringify(doc,null,2));
                                    resolve(doc);
                                });
                        });;
                    });
                    promise.then((doc) => {
                        boxheaderObject(doc);
                    });
                }
                someFunction(i, results);

            }
        });
        resolve(true);
    })
};
//'30518908','30680025','30521329'

var Ent09 = () => {
    return new Promise((resolve, reject) => {
        var request = new sql.Request();
        // query to the database and get the records
        request.query("select * from ENT009 where S09INUM in ('30680025')", function (err, result) {
            if (err) console.log("ENT009  " + err);
            for (var i = 0, len = result.rowsAffected; i < len; i++) {
                var ENT009 = result.recordset[i];
                //var shippingReceipt = new shippingReceiptModel(ENT009.S09INUM, ENT009.S09IRTR);
                var shippingReceipts = new ShippingReceipt();
                shippingReceipts.documentNum = ENT009.S09INUM;
                shippingReceipts.documentDate = ENT009.S09IRTR;
                shippingReceipts.save()
                    .then((doc) => {
                        Ent75(doc.documentNum);
                    }, (e) => {
                        console.log(e);
                    });
            }
            //console.log(_shippingReceipt);
            resolve();
        });
        // console.log(shippingReceipts[0]);
    })
};











sql.connect(webconfig, function (err) {

    if (err) console.log(err);
    // create Request object
    Ent09();
});
//mlh
