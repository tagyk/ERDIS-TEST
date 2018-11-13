
const sql      = require('mssql');
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
const pool     = new sql.ConnectionPool(config);


pool.on('error', err => {
    if (err) {
        console.log('sql errors', err);
    }
    if (!err) {
        pool.connect();
    }
});

exports.execSql = async function (sqlquery) {
    try {
        let result = await pool.request().query(sqlquery);
        return {success: result};
    } catch (err) {
        return {err: err};
    } finally {
        pool.close(); //closing connection after request is finished.
    }
};