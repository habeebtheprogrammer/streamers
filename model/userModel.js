var mongoose = require('../config/mongoose');
//user schema
var userSchema = mongoose.Schema({
    accountID: {
        type: String,
    },
    email: {
        type: String,
        trim: true
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    totalEarned: {
        type: Number,
        default: 0
    },
    amountUnpaid: {
        type: Number,
        default: 0
    },
    referralEarnings:{
        type:Number,
        default:0
    },
    payPercentage: {
        type: Number
    },
    referralPercentage:{
        type:Number,
        default:0
    },
    referredBy:{
        type:String
    },
    numReferrals:{
        type:String
    },
    banned: {
        type: Boolean,
        default:false
    },
    profileDetails: {
        picture: String,
        description:String
    },
    paymentDetails: {
        fullName:String,
        paymentMethod:{
            paypalEmail:String,
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
   
})
userSchema.index({ username: 'text'});
var User = mongoose.model('users', userSchema);

module.exports = User;
