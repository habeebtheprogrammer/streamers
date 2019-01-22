var mongoose = require('../config/mongoose');
//user schema
var userSchema = mongoose.Schema({
    accountID: {
        type: Number,
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
        type: Number,
        default: 80
    },
    referralPercentage:{
        type:Number,
        default:0
    },
    referredBy:{
        type: Number
    },
    numReferrals:{
        type:Number,
        default:0
    },
    banned: {
        type: Boolean,
        default:false
    },
    profileDetails: {
        picture: {
            type:String,
            default:"../../images/avatar.jpg"
        },
        description:{
            type:String,
            default: "Hi there, i am new to streamjar. you can tip me for free without spending your hard earned money"
        }
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
