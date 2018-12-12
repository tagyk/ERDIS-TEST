const  sql  = require('mssql');
var { ErrorLog } = require('./../server/models/ErrorLog');

const config_Depo = {
    server: "erktrdepos03",
    user: "ax",
    password: "465666",
    database: 'AXATAWM_CL',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    PoolTimeout: 199999, //3.3 min
    connectionTimeout: 1800000,// 30 min
    requestTimeout: 2999999, //50 min
    options: {
        trustedConnection: true,
        encrypt: false
    },
    pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 30000
    }
};
const config_MidaxSender = {
    server: "servertr192",
    user: "ax",
    password: "465666",
    database: 'MidaxSender',
    connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password};",
    PoolTimeout: 199999, //3.3 min
    connectionTimeout: 1800000,// 10 min
    requestTimeout: 2999999, //50 min
    options: {
        trustedConnection: true,
        encrypt: false
    },
    pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 30000
    }
};


module.exports =  class MssqlClient {

    constructor(_configName) {
        try {
            this.config
            if (_configName == 'MidaxSender') {
                this.config = config_MidaxSender;
                // this.pool1 = new sql.ConnectionPool(config_MidaxSender).connect();
            }
            else if (_configName == 'Depo') {
                this.config = config_Depo;
                //this.pool1 = new sql.ConnectionPool(config_Depo).connect();
            }
        } catch (e) {
            ErrorLog.AddLogData(e, "disconnect", "mssql-client.js");
            return false;
        }

    }
    async connect() {
        this.pool1= await new sql.ConnectionPool(config_Depo).connect();
        return this.pool1;
    }

    async disconnect() {
        try {
            await this.pool1.close();
            return true;

        } catch (e) {
            ErrorLog.AddLogData(e, "disconnect", "mssql-client.js");
            return false;
        }
    }
}



