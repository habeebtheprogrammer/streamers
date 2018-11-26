var mongoose = require('mongoose');
mongoose.connect("mongodb://guest:tamtamtools123@ds123171.mlab.com:23171/reactangle", { useMongoClient: true }, (suc)=>console.log("connected"))
// mongoose.connect("mongodb://127.0.0.1:27017/reactangle", { useMongoClient: true }, (suc)=>console.log("connected"))

    module.exports = mongoose; 