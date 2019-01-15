var mongoose = require('../config/mongoose');

var adminSchema = mongoose.Schema({
  
    username: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true
    },
    priviledge: {
        type: String,
        default:"admin"
    },
    profileDetails: {
        picture: {
            type:String,
            default:"../../images/avatar.jpg"
        },
        description:{
            type:String,
            default: "Administrator"
        }
    },
});

var Admin = mongoose.model('admin', adminSchema);
 module.exports = Admin

