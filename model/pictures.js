var mongoose = require('../config/mongoose');

var picturesSchema = mongoose.Schema({
    userID: {type:String,ref:"userModel"},
    username:String,
    imgUrl: String,
    description:String,
    date: Date,
    views: {
        type: Number,
        default: 0
    },
    privacy: {
        type: String,
        default: "public"
    }

});

var pictures = mongoose.model('pictures', picturesSchema);
module.exports = pictures;

