var mongoose = require('../config/mongoose');
var bcrypt = require('bcrypt');

var adminSchema = mongoose.Schema({
  
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        bcrypt: true
    },
    emailAddress: {
        unique: true,
        type: String
    },
    priviledge: {
        type: String,
        required: true
    },
    profilePicture : {
        type: String
    }
});

var Admin = mongoose.model('admin', adminSchema);
 module.exports = Admin

