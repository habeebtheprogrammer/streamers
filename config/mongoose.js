var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect("mongodb://guest:tamtamtools123@ds217671.mlab.com:17671/campusconnect", { useMongoClient: true }, (suc)=>console.log("connected"))
// mongoose.connect("mongodb://127.0.0.1:27017/campusconnect", { useMongoClient: true }, (suc)=>console.log("connected"))

    module.exports = mongoose; 