var router = require('express').Router();
var api = require('./api');

router.use('/api', api);

module.exports = router;