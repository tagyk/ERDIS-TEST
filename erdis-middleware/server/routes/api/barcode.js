var {User} = require('../../models/user');
var { ErrorLog } = require('../../models/ErrorLog');
var router = require('express').Router();
var { authenticate } = require('../authenticate');

router.get('/barcodes', authenticate, (req, res) => {

    var dataValues;

    apiQueue.find({ documentName: "Barcode", isSent: false }).then((result) => {
        dataValues = result.map(function (data) { return data.keyValue; });
        Barcode.find({ barcode: { $in: dataValues } })
            .sort({ _id: -1 })
            .select({ "_id": 0 })
            .then((result) => {
                res.send({ result });
            }, (e) => {
                res.status(400).send(e);
            });
    }, (e) => {
        ErrorLog.AddLogData(e, "api", "GET /Barcode server.js");
    });
});

module.exports = {router};