var mongoose = require('../config/mongoose');
//user schema
var schema = mongoose.Schema({
    userID:{
        type: mongoose.SchemaTypes.ObjectId,ref:"users"
     },
    date: {
        type: Date,
        default: Date.now
    },
    review: {
        type: String
    },
    rating: {
        type: Number
    },
})
var Reviews = mongoose.model('reviews', schema);
module.exports = Reviews;
