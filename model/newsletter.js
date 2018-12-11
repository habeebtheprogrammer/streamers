var mongoose = require('../config/mongoose');

var newSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    date: {
        type:Date,
        default: Date.now
    }
});

var Newsletter = mongoose.model("newsletter",newSchema);
module.exports = Newsletter;