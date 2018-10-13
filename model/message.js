var mongoose = require('../config/mongoose');
//contact schema
var messageSchema = mongoose.Schema({
    party: {
        type: String
    },
    user1: {
        type: String
    },
    user2: {
        type: String
    },
    messages: [{
        to: {
            type: String
        },
        from: {
            type: String
        },
        text: {
            type: String
        },
        receipt:{
            type:String,
            default: false
        },
        reference:{
            type:String
        },
        date: {
            type:Date,
            default: Date.now
        },
    }],
})

var Message = mongoose.model('message', messageSchema);

module.exports = Message;
