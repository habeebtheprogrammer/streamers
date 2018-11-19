var mongoose = require('../config/mongoose');
//region schema
var schema = mongoose.Schema({
    countryID:{
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
var City = mongoose.model('cities', schema);
module.exports = City;
