const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
var { User } = require('./models/user');

var { ShippingReceipt } = require('./models/ShippingReceipt');
var { authenticate } = require('./routes/authenticate');
var { ErrorLog } = require('./models/ErrorLog');
var routes = require('./routes');


var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
    extended: true
  }));*/
// app.use(app.router);
// routes.initialize(app);
//app.use(require('./routes'));
app.use('/',routes);

app.listen(3002, () => {
    console.log(`WMS UA Started up at port 3002`);
});


