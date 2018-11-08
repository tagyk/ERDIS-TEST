var sql = require("mssql");





var webconfig = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    options: {
        trustedConnection: false,
        encrypt: false
    }


};
class shippingReceiptModel {

    constructor(_documentNum, _documentDate) {
        this.documentNum = _documentNum;
        this.documentDate = _documentDate;
        this.boxHeaders = [boxHeaderModel];

        function addboxHeaders(_boxHeaderModel) {
            boxDetails.push(boxHeaderModel);
        }
    }




}
class boxHeaderModel {

    constructor(boxHeaderNo, locationToAccount) {
        this.boxHeaderNo = boxHeaderNo;
        this.locationToAccount = locationToAccount;
        this.boxDetails = [];

        function addDetails(_barcode, _qty, _boxnum) {
            boxDetails.push({
                barcode: _barcode,
                qty: _qty,
                boxNum: _boxnum
            });
        }
    }
}



var shippingReceipts = [];
var shippingReceipt;
var ENT009;
var ENT0075, ENT0076;
var boxheader;




sql.connect(webconfig, function (err) {

    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query("select * from ENT009 where S09INUM in ('30518908',30680025)", function (err, result) {
        if (err) console.log("ENT009  " + err);
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            ENT009 = result.recordset[i];
            shippingReceipt = new shippingReceiptModel(ENT009.S09INUM, ENT009.S09IRTR);

        }
    });
    for (var i = 0, len = shippingReceipts.length; i < len; i++) {
        request.query(`select S75KOLINO,S75SFIRM from  ENT0075 where S75IRNO = ${shippingReceipts.documentNum} group by S75KOLINO,S75SFIRM`, function (err, results) {
            if (err) console.log("ENT0075  " + err);
            for (var i = 0, len = results.rowsAffected; i < len; i++) {
                ENT0075 = results.recordset[i];
                boxheader = new boxHeaderModel(ENT0075.S75KOLINO, ENT0075.S75SFIRM);
            }
            shippingReceipts.
        });
    }

});
//mlh

