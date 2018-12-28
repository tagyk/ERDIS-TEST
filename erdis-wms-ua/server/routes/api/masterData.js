var {User} = require('../../models/user');
var { Barcode } = require('../../models/barcode');
var { ErrorLog } = require('../../models/ErrorLog');
var { ApiQueue } = require('../../models/apiQueue');
var { Product } = require('../../models/product');
var { BillOfMaterial } = require('../../models/billOfMaterial');
var { kafka } = require('../../../kafka-client/kafkaClient');


var router = require('express').Router();
var { authenticate } = require('../authenticate');





// GET /barcode
router.get('/barcodes', authenticate, (req, res) => {

    var dataValues;
    apiQueue.find({ documentName: "Barcode", isSent: false }).then((result) => {
        dataValues = result.map(function (data) { return data.keyValue; });
        Barcode.find({ barcode: { $in: dataValues } })
        .sort({ _id: -1 })
        .select({ "_id": 0})
        .then((result) => {
            res.send({ result });
        }, (e) => {
            res.status(400).send(e);
        });
    }, (e) => {
        ErrorLog.AddLogData(e, "api", "GET /Barcode server.js");
    });
});

// patch /barcode commit
router.patch('barcodes/commit/:barcode', authenticate, (req, res) => {
    var _refDocNum = req.params.documentNum;
    var _token = req.header('x-auth');
    var UserName;
    User.findByToken(_token).then((user) => {
        UserName = user.name;
        apiQueue.findOneAndUpdate({ keyValue: _refDocNum, documentName: "Barcode" }, { $set: { isSent: 'true', sentAt: Date.now(), sentBy: UserName } }, { new: true }, function (err, result) {
            if (err) {
                res.status(400).send(err);
                ErrorLog.AddLogData(err, "api", "patch /barcode commit");
            }
            res.status(200).send();
        });
    }).catch((e) => {
        ErrorLog.AddLogData(err, "api", "patch /barcode commit User.findByToken");
    });
    
});


// GET /product
router.get('/products', authenticate, (req, res) => {
    var dataValues;
    apiQueue.find({ documentName: "Product", isSent: false }).then((result) => {
        dataValues = result.map(function (data) { return data.keyValue; });
        Product.find({ barcode: { $in: dataValues } })
        .sort({ _id: -1 })
        .select({ "_id": 0})
        .then((result) => {
            res.send({ result });
        }, (e) => {
            res.status(400).send(e);
        });
    }, (e) => {
        ErrorLog.AddLogData(e, "api", "GET /Barcode server.js");
    });
});

// patch /barcode commit
router.patch('barcodes/commit/:barcode', authenticate, (req, res) => {
    var _refDocNum = req.params.documentNum;
    var _token = req.header('x-auth');
    var UserName;
    User.findByToken(_token).then((user) => {
        UserName = user.name;
        apiQueue.findOneAndUpdate({ keyValue: _refDocNum, documentName: "Barcode" }, { $set: { isSent: 'true', sentAt: Date.now(), sentBy: UserName } }, { new: true }, function (err, result) {
            if (err) {
                res.status(400).send(err);
                ErrorLog.AddLogData(err, "api", "patch /barcode commit");
            }
            res.status(200).send();
        });
    }).catch((e) => {
        ErrorLog.AddLogData(err, "api", "patch /barcode commit User.findByToken");
    });
    
});

module.exports = {router};