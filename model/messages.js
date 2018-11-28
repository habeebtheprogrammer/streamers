var mongoose = require('../config/mongoose');
//user schema
var schema = mongoose.Schema({
    senderID:{
        type: mongoose.SchemaTypes.ObjectId,ref:"users"
     },
    date: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    ticket:{
        type:String
    },
    title:String,
    price: Number,
    accepted: Boolean,
    declined: Boolean,
    conversation: [
        {
        senderID:{type:mongoose.SchemaTypes.ObjectId,ref:"users"},
        date: {
            type: Date,
            default: Date.now
        },
        message:{type: String},
        }
    ]
})
var Message = mongoose.model('messages', schema);
module.exports = Message;
