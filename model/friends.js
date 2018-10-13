var mongoose = require('../config/mongoose');
//user schema
var userSchema = mongoose.Schema({
  userID:{
     type: mongoose.SchemaTypes.ObjectId,ref:"users"
  },
  username:{
      type: String,
  },
  privacy:{
      type: String,
      default: "public"
  },
  list:[
    { userID: {
        type: mongoose.SchemaTypes.ObjectId,ref:"users"
    },
    type:{type: String}
 
}
  ]
})
var Friends = mongoose.model('friends', userSchema);

module.exports = Friends;
