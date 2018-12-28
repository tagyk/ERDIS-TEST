
var mongoose = require('mongoose');


//mongoose.plugin(toJson);
mongoose.set('useFindAndModify', false);


//mongoose.Promise = global.Promise;
var conn = mongoose.createConnection('mongodb://localhost:27017/ErdisConfig', {
    useCreateIndex: true,
    useNewUrlParser: true
});

module.exports = { conn };
