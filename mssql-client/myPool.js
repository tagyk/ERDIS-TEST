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
const pool1 = new mssql.ConnectionPool(config).connect();


myPool.connect = async function () {

    return await pool1;
};


myPool.newPool = function () {

    return new Promise(function (resolve, reject) {
        if (!myPool.connected) {
            myPool.connect()
                .then(function (result) {
                    myPool.connected = true;
                    resolve(result);
                });
        }
        else {
            resolve(pool1.then(function (value) {
                return (value);
            }));
        }
    });
};

module.exports = { myPool };