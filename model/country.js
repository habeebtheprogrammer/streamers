var mongoose = require('../config/mongoose');
//region schema
var schema = mongoose.Schema({
    regionID:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"countries"
    },
    title:{
        type:String
    },
    imgUrl:{
        type:String
    }
})
schema.index({ title: 'text' });
var Country = mongoose.model('countries', schema);
module.exports = Country;
