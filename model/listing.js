var mongoose = require('../config/mongoose');
//listing schema
var listingSchema = mongoose.Schema({
    creatorID:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"users"
    },
    title:{
        type:String
    },
    category:{
        type:String
    },
    subcategory:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    region:{
        type:String
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    location:{
        type:String
    },
    gmapLink:{
        type:String
    },
    cancellation:{
        type:Boolean
    },
    duration:{
        type:Boolean
    },
    voucher:{
        type:Boolean
    },
    voucher2:{
        type:Boolean
    },
    openDate:{
        type:Boolean
    },
    completed:{
        type:Boolean,
        default:false
    },
    activityInfo:{
        type:String
    },
    additionalInfo:{
        type:String
    },
    wte:[{
        name:{
            type:String
        },
        description:{
            type:String
        },
        img:{
            type:String
        },
    }],
    packageOption:[{
        name:{
            type:String
        },
        title:{
            type:String
        },
        description:{
            type:String
        },
        price:{
            type:String
        },
    }],
    openingHours:[{
        day:{
            type:String
        },
        start:{
            type:String
        },
        end:{
            type:String
        },
        ticketNum: {
            type: Number
        }
    }],
   views:{
       type:Number,
       default:0
   },
   date: {
    type: Date,
    default: Date.now
}
})
listingSchema.index({ title: 'text', location:'text', city:'text',country:'text' });
var Listing = mongoose.model('listing', listingSchema);

module.exports = Listing;
