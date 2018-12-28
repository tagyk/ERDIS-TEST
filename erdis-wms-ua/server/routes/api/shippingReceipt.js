var {User} = require('../../models/user');
var { ShippingReceipt } = require('../../models/ShippingReceipt');
var { ErrorLog } = require('../../models/ErrorLog');
var router = require('express').Router();
var { authenticate } = require('../authenticate');
var { apiQueue } = require('../../models/apiQueue');


//POST /shippingReceipt
router.post('/add', (req, res) => {
    var body = req.body;// _.pick(req.body, ['documentNum', 'locationTo']);
    var shippingReceipts = new ShippingReceipt(body);
    shippingReceipts.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /shippingReceipt
router.get('/', authenticate, (req, res) => {
    var dataValues;
    apiQueue.find({ documentName: "ShippingReceipt", isSent: false }).then((result) => {
        dataValues = result.map(function (data) { return data.keyValue; });
        ShippingReceipt.find({ documentNum: { $in: dataValues } })
        .sort({ _id: -1 })
        .select({ "_id": 0,"boxHeader.boxDetails": 0 })
        .then((shippingReceipts) => {
            res.send({ shippingReceipts });
        }, (e) => {
            res.status(400).send(e);
        });
    }, (e) => {
        ErrorLog.AddLogData(e, "api", "GET /shippingReceipt server.js");
    });
});

// patch /shippingReceipt commit
router.patch('/commit/:documentNum', authenticate, (req, res) => {
    var _refDocNum = req.params.documentNum;
    var _token = req.header('x-auth');
    var UserName;
    User.findByToken(_token).then((user) => {
        UserName = user.name;
        apiQueue.findOneAndUpdate({ keyValue: _refDocNum }, { $set: { isSent: 'true', sentAt: Date.now(), sentBy: UserName } }, { new: true }, function (err, result) {
            if (err) {
                res.status(400).send(err);
                ErrorLog.AddLogData(err, "api", "patch /shippingReceipt commit");
            }
            res.status(200).send();
        });
    }).catch((e) => {
        ErrorLog.AddLogData(err, "api", "patch /shippingReceipt commit User.findByToken");
    });
    
});


module.exports = {router};