var mongoose = require('../config/mongoose');
//region schema
var regionSchema = mongoose.Schema({
   
    title:{
        type:String
    },
    imgUrl:{
        type:String
    }
})
var Regions = mongoose.model('regions', regionSchema);
module.exports = Regions;
