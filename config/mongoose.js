var mongoose = require('mongoose');
mongoose.connect("mongodb://guest:t1z2o3o4r5@ds225840.mlab.com:25840/tzoor", { useMongoClient: true }, (suc)=>console.log("connected"))
// mongoose.connect("mongodb://127.0.0.1:27017/reactangle", { useMongoClient: true }, (suc)=>console.log("connected"))

    module.exports = mongoose; 