
var mongoose = require('mongoose');
const toJson = require('@meanie/mongoose-to-json');

//mongoose.plugin(toJson);
mongoose.set('useFindAndModify', false);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ErdisDev',{
    useCreateIndex: true,
    useNewUrlParser: true 
});

module.exports = {mongoose};
