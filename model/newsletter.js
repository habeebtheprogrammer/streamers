var mongoose = require('../config/mongoose');

var Newsletterschema = mongoose.Schema({
   
    email: {
        type: String
    },
    lastName: {
        type: String
    },
    firstName: {
        type: String
    },
    country: {
        type: String
    },
    subscription: {
        type: Boolean,
        default:true

    },
});

var Newsletter = mongoose.model('newsletter', Newsletterschema);
module.exports = Newsletter;

