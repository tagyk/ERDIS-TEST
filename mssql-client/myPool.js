var mssql = require('mssql');
var myPool = {}
myPool.connected = false;
const config = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    PoolTimeout: 22000,
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

myPool.connect =  function () {


    let promise =  mssql.connect(config);

    promise.catch(function (err) {

        // handling error
        mssql.close();
        myPool.connected = false;
    });
    return promise;
};

myPool.newPool = function () {

    return new Promise(function (resolve, reject) {


        if (!myPool.connected) {

            myPool.connect()
                .then(function (result) {
                    myPool.connected = true;
                    resolve(result);
                });
        } else {

            resolve(new mssql.ConnectionPool(config));
        }
    });
};

module.exports = { myPool };