var mongoose = require('../config/mongoose');

var postSchema = mongoose.Schema({
   
    type: {type:String },
    section: {
        type:String
      },
    frontpage:{
        type: Boolean,
        default: false
    },
    imgUrl: String,
    videoUrl: String,
    title: String,
    description:String,
    date: {
        type:Date,
        default: Date.now
    },
    userID:{type:String,ref:"users"},
    views: {
        type: Number,
        default: 0
    },
    privacy: {
        type: String,
        default: "public"
    }
});

var forumposts = mongoose.model('forumposts', postSchema);
module.exports = forumposts;

