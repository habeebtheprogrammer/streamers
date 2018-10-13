var mongoose = require('../config/mongoose');

var groupSchema = mongoose.Schema({
    creatorID: {type:mongoose.SchemaTypes.ObjectId, ref:"users"},
    title:String,
    description:String,
    date: {type:Date,
        default: Date.now
    },
    dpUrl: String,
    status:String,
    members:[
        {userID:{type:mongoose.SchemaTypes.ObjectId,ref:"users"},
        type:{type:String},
        date: {type:Date,
            default: Date.now
        },
    }],
    privacy: {
        type: String,
        default: "public"
    }
});
groupSchema.index({ title:'text'});

var group = mongoose.model('group', groupSchema);
module.exports = group;

