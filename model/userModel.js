var mongoose = require('../config/mongoose');
//user schema
var userSchema = mongoose.Schema({
    fullName: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    role:{
        type: String
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
    },
    creatorID:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"users"
    }
   
})
userSchema.index({ username: 'text', location:"text", fullName:"text"});
var User = mongoose.model('users', userSchema);

module.exports = User;
