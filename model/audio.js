var mongoose = require('../config/mongoose');

var audioSchema = mongoose.Schema({
    userID: String,
    src: String,
    name: {
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: String
    },
    img: {
        type: String
    },
    imgID: String,
    industry: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    }
});

var audio = mongoose.model('audio', audioSchema);
module.exports = audio;

