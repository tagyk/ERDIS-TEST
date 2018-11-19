const sql = require('mssql');
const fs = require("fs");
var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
var { myPool } = require('./myPool');


const config = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    requestTimeout: 100000,
    options: {
        trustedConnection: true,
        encrypt: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};





async function getEnt009(_documentNum, _totalQty) {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, _documentNum)
            .query('select S09INUM,S09IRTR from ENT009 where S09INUM = @input_parameter')
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT009 = result.recordset[i];
            var shippingReceipts = new ShippingReceipt({
                documentNum: ENT009.S09INUM,
                documentDate: ENT009.S09IRTR,
                totalQTY: _totalQty
            }).save().then((temp) => {
                //console.log(temp);
                const data = temp.documentNum;
                return Promise.all([data]);
            }, (e) => {
                console.log(e);
            }).then(async ([data]) => {
                await getEnt075(data);
            })
        }

    }
    catch (err) {
        console.log(err);
    }



};


async function getEnt075(_documentNum) {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, _documentNum)
            .query('select S75KOLINO,S75SFIRM from ENT0075 where S75IRNO = @input_parameter group by S75KOLINO,S75SFIRM order by S75KOLINO desc');
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT0075 = result.recordset[i];
            let vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
            if (vShippingReceipt.locationToAccount !== '') vShippingReceipt.locationToAccount = ENT0075.S75SFIRM;
            await vShippingReceipt.boxHeader.push({ barcode: ENT0075.S75KOLINO });
            let doc = await vShippingReceipt.save();
            await getEnt076({ docId: vShippingReceipt._id, boxNo: ENT0075.S75KOLINO, subId: vShippingReceipt.boxHeader[vShippingReceipt.boxHeader.length - 1]._id });
        }
    }
    catch (err) {
        console.log(err);
    }

};

async function getEnt076(_doc) {
    try {
        //console.log(JSON.stringify(_doc, null, 2));
        let pool = await myPool.newPool();
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, _doc.boxNo)
            .query('select *  from ENT0076  where S76KOLINO = @input_parameter order by S76SKU desc');
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT0076 = result.recordset[i];
            (async function (ENT0076, _doc) {
                //var _ShippingReceipt =  await ShippingReceipt.findOne({'boxHeader.barcode' : _doc.boxNo});
                //console.log(JSON.stringify(_ShippingReceipt, null, 2));
                var _ShippingReceipt = await ShippingReceipt.findById(_doc.docId)
                var sub = await _ShippingReceipt.boxHeader.id(_doc.subId);
                //console.log(JSON.stringify(sub, null, 2));
                await sub.boxDetails.push({ barcode: ENT0076.S76SKU, qty: ENT0076.S76MIKTAR });
                await _ShippingReceipt.save();
                //fs.appendFile('tmp.json',JSON.stringify("+",null,2));
            })(ENT0076, _doc);
        }
    } catch (err) {
        console.log(err);
    }

};



sql.on('error', err => {
    console.log(err);
});



(async function () {
    try {
        let pool = await myPool.newPool();
        let result = await pool.request()
            .query('select * from getOrders');   // order by S09INUM desc  OFFSET 0 rows  fetch next 50  rows only
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            const docnum = await getEnt009(result.recordset[i].S09INUM, result.recordset[i].DetailsCount);
        }


    } catch (err) {
        // ... error checks
        console.log(err);
    }

})().then(() => {
    console.log("done");
}).catch((e) => {
    console.log(e);
});;



