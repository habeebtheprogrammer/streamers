var mongoose = require('../config/mongoose');

var postSchema = mongoose.Schema({
    username:String,
    userID:{type:mongoose.SchemaTypes.ObjectId,ref:"users"},
    type: {type:String ,
            default:"sectionpost"},
    imgUrl: String,
    videoUrl: String,
    title: String,
    description:String,
    section: String,
    fp: {
        type:Boolean,
        default:true
    },
    date: {type:Date,default:Date.now},
    views: {
        type: Number,
        default: 0
    },
    comments:[
        {
            userID:{type:mongoose.SchemaTypes.ObjectId, ref:"users"},
            description:{type:String},
            date: {type:Date,default:Date.now},
            likes:[
                {type:mongoose.SchemaTypes.ObjectId, ref:"users" }
            ],
            reply:[
                {userID:{type:mongoose.SchemaTypes.ObjectId, ref:"users" },
                description:String,
                date: {type:Date,default:Date.now},

            }

            ]
        }
    ],
    likes:[
        {type:mongoose.SchemaTypes.ObjectId, ref:"users" }
    ]
    ,
    followers:[
        {type:mongoose.SchemaTypes.ObjectId, ref:"users" }
    ],
    flag:{
        users:Number,
        userID:[mongoose.SchemaTypes.ObjectId]
    }

});
postSchema.index({ title:'text'});

var post = mongoose.model('sectionposts', postSchema);
module.exports = post;

