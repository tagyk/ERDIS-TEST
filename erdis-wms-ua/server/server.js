const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { mongooseErdisConf } = require('./db/mongoose-erdis-config');
var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { ShippingReceipt } = require('./models/ShippingReceipt');
var { authenticate } = require('./middleware/authenticate');
var { ShippingReceiptStatus } = require('./models/ShippingReceiptStatus');

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
    ShippingReceipt.find().sort({_id : -1 }).select({ "boxHeader.boxDetails.isAssorment": 0 , "_id": 0}).limit(10).then((shippingReceipts) => {
        res.send({ shippingReceipts });
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /shippingReceiptStatus
app.get('/shippingReceipt/status', authenticate, (req, res) => {
    ShippingReceiptStatus.find().then((result) => {
        res.send({ result });
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /shippingReceiptStatus documentNum
app.get('/shippingReceipt/status/:documentNum', authenticate, (req, res) => {
    var _docNum = req.params.documentNum;
    ShippingReceiptStatus.find({documentNum : _docNum}).then((result) => {
        res.send({ result });
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /shippingReceiptStatus UpdateStatus
app.patch('/shippingReceipt/updateStatus/:boxId', authenticate, (req, res) => {
    var _refBoxId = req.params.boxId;
    var body = _.pick(req.body, ['status']);
    ShippingReceiptStatus.findOne({ refBoxId: _refBoxId }, function (err, result) {
        ShippingReceiptStatus.findByIdAndUpdate(result._id, {
            $push: { statusTimeline: { prevStatus: result.status, prevUpdateAt: result.statusUpdatedAt } },
            $set: { status: body.status, statusUpdatedAt: new Date() }
        }, { new: true }, function (err, doc) {
            res.send({ status: doc.status, uptDate: doc.statusUpdatedAt });
        }, (e) => {
            res.status(400).send(e);
        });
    });
});



// GET /shippingReceiptStatus updateLocation
app.patch('/shippingReceipt/updateLocation/:boxId', authenticate, (req, res) => {
    var _refBoxId = req.params.boxId;
    var body = _.pick(req.body, ['location']);
    ShippingReceiptStatus.findOne({ refBoxId: _refBoxId }, function (err, result) {
        ShippingReceiptStatus.findByIdAndUpdate(result._id, {
            $push: { locationTimeline: { prevStatus: result.location, prevUpdateAt: result.locationUpdatedAt } },
            $set: { location: body.location, locationUpdatedAt: new Date() }
        }, { new: true }, function (err, doc) {
            res.send({ location: doc.location, uptDate: doc.locationUpdatedAt });
        }, (e) => {
            res.status(400).send(e);
        });
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

