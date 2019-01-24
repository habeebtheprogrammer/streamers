var mongoose = require('mongoose');

// mongoose.connect("mongodb://guest:streamjar123@ds155774.mlab.com:55774/streamjar", { useMongoClient: true }, (suc)=>console.log("connected"))
mongoose.connect("mongodb://127.0.0.1:27017/streamjar", { useMongoClient: true }, (suc)=>console.log("connected"))
    module.exports = mongoose; 