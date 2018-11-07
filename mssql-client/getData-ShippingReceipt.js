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

sql.connect(webconfig, function (err) {

    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query("select * from ENT009 where S09INUM in ('30518908',30680025)", function (err, result) {
        if (err) console.log("ENT009  " + err);
        for (var i = 0, len = result.rowsAffected; i < len; i++) {
            var ENT009 = result.recordset[i];
            request.query(`select S75KOLINO,S75SFIRM from  ENT0075 where S75IRNO = ${ENT009.S09INUM} group by S75KOLINO,S75SFIRM`, function (err, result) {
                if (err)("ENT0075  " + err);
                var ENT0075 = result.recordset[i];
                    
            });
            
            
            
            
            
            
            var _shippingReceipt = {
                documentNum : ENT009.S09INUM ,
                documentDate : ENT009.S09IRTR ,
            }
            console.log(_shippingReceipt);
        }
            
        
        // console.log(ENT009.recordsets); 
        // console.log(_shippingReceipt);
        ;      
    });
});
//mlh

