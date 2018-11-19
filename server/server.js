const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

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
    ShippingReceipt.find().then((shippingReceipts) => {
        res.send({ shippingReceipts });
    }, (e) => {
        res.status(400).send(e);
    });
});


app.post('/shippingReceipt/updateStatus', (req, res) => {

    var body = _.pick(req.body, ['documentNum', 'boxBarcode', 'status']);
    ShippingReceiptStatus.findOneAndUpdate({ documentNum: body.documentNum, boxBarcode: body.boxBarcode }, { $set: { status: body.status } }, { new: true }, function (err, doc) {
        res.send(doc.location);
    }, (e) => {
        res.status(400).send(e);
    });
});




app.post('/shippingReceipt/updateLocation', (req, res) => {

    var body = _.pick(req.body, ['documentNum', 'boxBarcode', 'location']);
    ShippingReceiptStatus.findOneAndUpdate({ documentNum: body.documentNum, boxBarcode: body.boxBarcode }, { $set: { location: body.location } }, { new: true }, function (err, doc) {
        res.send(doc.location);
    }, (e) => {
        res.status(400).send(e);
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
    console.log(`Started up at port 3002`);
});

module.exports = { app };

