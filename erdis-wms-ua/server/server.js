const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { User } = require('./models/user');
var { apiQueue } = require('./models/apiQueue');
var { ShippingReceipt } = require('./models/ShippingReceipt');
var { authenticate } = require('./middleware/authenticate');
var { ErrorLog } = require('./models/ErrorLog');


var app = express();
app.use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
    extended: true
  }));*/

//POST /shippingReceipt
app.post('/shippingReceipt', (req, res) => {
    var body = req.body;// _.pick(req.body, ['documentNum', 'locationTo']);
    var shippingReceipts = new ShippingReceipt(body);
    shippingReceipts.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


// GET /shippingReceipt
app.get('/shippingReceipt', authenticate, (req, res) => {
    var dataValues;
    apiQueue.find({ documentName: "ShippingReceipt", isSent: false }).then((result) => {
        dataValues = result.map(function (data) { return data.keyValue; });
        ShippingReceipt.find({ documentNum: { $in: dataValues } }).sort({ _id: -1 }).select({ "boxHeader.boxDetails.isAssorment": 0, "_id": 0 }).then((shippingReceipts) => {
            res.send({ shippingReceipts });
        }, (e) => {
            res.status(400).send(e);
        });
    }, (e) => {
        ErrorLog.AddLogData(e, "api", "GET /shippingReceipt server.js");
    });
});

// patch /shippingReceipt commit
app.patch('/shippingReceipt/commit/:documentNum', authenticate, (req, res) => {
    var _refDocNum = req.params.documentNum;
    apiQueue.findOneAndUpdate({ keyValue: _refDocNum }, { $set: { isSent: 'true', sentAt: Date.now()  } }, { new: true }, function (err, result) {
        if (err){ 
            res.status(400).send(err);
            ErrorLog.AddLogData(e, "api", "patch /shippingReceipt commit");
        }
        res.status(200).send();
    });
});







// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// REMOVE TOKEN
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});



app.listen(3002, () => {
    console.log(`WMS UA Started up at port 3002`);
});

module.exports = { app };

