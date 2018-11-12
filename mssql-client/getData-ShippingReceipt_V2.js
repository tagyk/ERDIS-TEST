const sql = require('mssql');
var { mongoose } = require('./../server/db/mongoose');
var { ShippingReceipt } = require('./../server/models/ShippingReceipt');
const config = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    requestTimeout: 22000,
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

async function ent009(_documentNum) {
    let result
    
    try {
        let pool = await sql.connect(config);
        result = await pool.request()
            .input('input_parameter', sql.NVarChar, _documentNum)
            .query('select S09INUM,S09IRTR from ENT009 where S09INUM = @input_parameter')
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT009 = result.recordset[i];
            var shippingReceipts = new ShippingReceipt();
            shippingReceipts.documentNum = ENT009.S09INUM;
            shippingReceipts.documentDate = ENT009.S09IRTR;
            shippingReceipts.save()
                .then( (temp) => {
                    //console.log(temp);
                    const data = temp.documentNum;
                    return Promise.all([data]);
                }, (e) => {
                    console.log(e);
                }).then(async([data]) => {
                    sql.close();    
                    const doc = await ent075(data);
                };
                // ).then(async([data]) => {

                // });
            
            
        }
        sql.close();
        

    }
    catch (err) {
        console.log(err);
        sql.close();
    }
};


async function ent075(_documentNum) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, _documentNum)
            .query('select S75KOLINO,S75SFIRM from ENT0075 where S75IRNO = @input_parameter group by S75KOLINO,S75SFIRM');
        console.log(result);
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT0075 = result.recordset[i];
            ShippingReceipt.findOne({ documentNum: _documentNum }, function (err, ShippingReceipt) {
                if (err) throw err;
                if (ShippingReceipt.locationToAccount !== '') ShippingReceipt.locationToAccount = ENT0075.S75SFIRM;
                ShippingReceipt.boxHeader.push({ barcode: ENT0075.S75KOLINO });
                ShippingReceipt.save()
                    .then((doc) => {
                        console.log(doc);
                    });
            });
        }
        sql.close();
    }
    catch (err) {
        console.log(err);
        sql.close();
    }
};

async function ent076(_doc) {
    try {
        let boxHeaderNo = _doc.boxHeader[0].barcode;
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('input_parameter', sql.NVarChar, boxHeaderNo)
            .query('select *  from ENT0076  where S76KOLINO = @input_parameter');
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT0076 = result.recordset[k];
            ShippingReceipt.findById(_doc._id, function (err, _ShippingReceipt) {
                var subdoc = _ShippingReceipt.boxHeader.id(_doc.boxHeader[0]._id);
                subdoc.boxDetails.push({ barcode: ENT0076.S76SKU, qty: ENT0076.S76MIKTAR });
                _ShippingReceipt.save()
                    .then((doc) => {
                        //console.log(doc);
                        //fs.appendFile('tmp.json', JSON.stringify(doc, null, 2));
                        //resolve(doc);
                    });
            });
        }
        sql.close();

    } catch (err) {
        console.log(err);

    }
};







(async function () {
    try {
        pool = await sql.connect(config);
        result = await pool.request()
            .query('select top(2) * from getOrders');
        sql.close();
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            const docnum = await ent009(result.recordset[i].S09INUM);


        }
        console.log("done");

    } catch (err) {
        // ... error checks
    }
})();

sql.on('error', err => {
    console.log(err);
});


