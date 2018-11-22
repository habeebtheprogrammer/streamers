var mongoose = require('../config/mongoose');
//user schema
var userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    location: {
        type: String,
    },
    phone:{
        type:String
    },
    dpUrl: {
        type: String
    },
    twitter:{
        type:String
    },
    facebook:{
        type:String
    },
    description:{
        type:String
    },
    email: {
        type: String,
        trim: true
    },
    regDate: {
        type: Date,
        default: Date.now
    },
    country: {
        type: String
    }
   
})
userSchema.index({ username: 'text', location:"text", fullName:"text"});
var User = mongoose.model('users', userSchema);

module.exports = User;
