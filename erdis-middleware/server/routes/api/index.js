var router = require('express').Router();
var user = require('./user');
var shippingReceipt = require('./shippingReceipt');
//router.use('/', user);

router.use('/user', user.router);


// router.use(function (err, req, res, next) {
//     if (err.name === 'ValidationError') {
//         return res.status(422).json({
//             errors: Object.keys(err.errors).reduce(function (errors, key) {
//                 errors[key] = err.errors[key].message;

//                 return errors;
//             }, {})
//         });
//     }

//     return next(err);
// });

module.exports = router;