//melihhhh
//en üste yazdım. Taygun

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ErdisDev',{
    useCreateIndex: true,
    useNewUrlParser: true 
});

module.exports = {mongoose};
