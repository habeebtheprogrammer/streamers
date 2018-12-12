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
    conversation: [
        {
        senderID:{type:mongoose.SchemaTypes.ObjectId,ref:"users"},
        date: {
            type: Date,
            default: Date.now
        },
        message:{type: String},
        requestBudget: {type:Number},
        offerDesc:{type: String},
        offerTitle:{type:String},
        offerBudget:{type:Number},
        offerDuration:{type:Number},
        },

    ]
})
var Message = mongoose.model('messages', schema);
module.exports = Message;
