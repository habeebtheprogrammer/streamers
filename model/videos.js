var mongoose = require('../config/mongoose');

var video = mongoose.Schema({
    userID: String,
    username:String,
    videoUrl: String,
    description: {
        type: String
    },
    date: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    youtubelink:{
        type: String
    },
    privacy:{
        type: String,
        default: "public"
    }
});

var videos = mongoose.model('videos', video);
module.exports = videos;

