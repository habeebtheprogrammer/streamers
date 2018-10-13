var mongoose = require('../config/mongoose');
//contact schema
var groupChatSchema = mongoose.Schema({
    groupID: {
        type: String
    },
    messages: [{
        userID:{type:String},
        username:String,
        fullName:String,
        text: {
            type: String
        },
        date: {
            type: String
        }
    }],
})

var Groupchat = mongoose.model('groupchat', groupChatSchema);

module.exports = Groupchat;
