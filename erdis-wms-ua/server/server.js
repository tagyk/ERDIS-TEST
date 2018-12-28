
const express = require('express');
const bodyParser = require('body-parser');

var routes = require('./routes');


var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use('/',routes);

app.listen(3002, () => {
    console.log(`WMS UA Started up at port 3002`);
});


