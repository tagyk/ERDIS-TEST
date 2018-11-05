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
    request.query("select TOP (10)* from CancelledOrders", function (err, result) {

        if (err) console.log(err)
        console.log(result.rowsAffected[0]);
        console.log(result.recordset[0].MNUCODE);

        console.dir(result);

    });
});
//tagyk


